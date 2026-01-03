import { requireMinRole } from '../middleware/guards.js';
import { createAuditLog } from '../utils/auditLog.js';
import { GraphQLError } from 'graphql';

export const reorderResolvers = {
  Query: {
    orders: async (_, { status }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const where = status ? { status } : {};

      return await prisma.order.findMany({
        where,
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          },
          approvedBy: {
            include: {
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    },

    order: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          },
          approvedBy: {
            include: {
              role: true
            }
          }
        }
      });

      if (!order) {
        throw new GraphQLError('Order not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return order;
    }
  },

  Mutation: {
    createOrder: async (_, { supplierId, items }, { prisma, user }) => {
      requireMinRole(user, 'cashier');

      // Calculate total and prepare order items
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new GraphQLError(`Product ${item.productId} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        const subtotal = item.unitPrice * item.quantity;
        total += subtotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal
        });
      }

      // Create order
      const order = await prisma.order.create({
        data: {
          supplierId,
          total,
          status: 'pending',
          items: {
            create: orderItems
          }
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          }
        }
      });

      await createAuditLog(
        prisma,
        user.id,
        'CREATE',
        'Order',
        order.id,
        { supplierId, total, itemCount: items.length }
      );

      return order;
    },

    approveOrder: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const order = await prisma.order.update({
        where: { id },
        data: {
          status: 'approved',
          approvedById: user.id,
          approvedAt: new Date()
        },
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          },
          approvedBy: {
            include: {
              role: true
            }
          }
        }
      });

      await createAuditLog(prisma, user.id, 'APPROVE', 'Order', id);

      // Send email notification to supplier
      const managerEmail = process.env.MANAGER_EMAIL;
      
      if (managerEmail) {
        try {
          const { sendOrderApprovalNotification } = await import('../utils/emailService.js');
          await sendOrderApprovalNotification(order, managerEmail);
          console.log(`✅ Order approval email sent for order #${order.id} to ${order.supplier.email}`);
        } catch (error) {
          console.error(`❌ Failed to send order approval email:`, error.message);
        }
      } else {
        console.log('⚠️ Manager email not configured. Skipping order approval email notification.');
      }

      return order;
    },

    updateOrderStatus: async (_, { id, status }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const validStatuses = ['pending', 'approved', 'sent', 'received'];
      if (!validStatuses.includes(status)) {
        throw new GraphQLError('Invalid status', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          supplier: true,
          items: {
            include: {
              product: true
            }
          },
          approvedBy: {
            include: {
              role: true
            }
          }
        }
      });

      // If order is received, update product stock
      if (status === 'received') {
        for (const item of order.items) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity
              }
            }
          });
        }
      }

      await createAuditLog(prisma, user.id, 'UPDATE_STATUS', 'Order', id, { newStatus: status });

      return order;
    }
  }
};
