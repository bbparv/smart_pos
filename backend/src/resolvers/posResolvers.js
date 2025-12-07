import { requireAuth, requireMinRole } from '../middleware/guards.js';
import { createAuditLog } from '../utils/auditLog.js';
import { GraphQLError } from 'graphql';

export const posResolvers = {
  Query: {
    transactions: async (_, { limit = 50, offset = 0 }, { prisma, user }) => {
      requireAuth(user);

      const where = user.role.name === 'cashier' 
        ? { userId: user.id } 
        : {};

      return await prisma.transaction.findMany({
        where,
        include: {
          user: { include: { role: true } },
          items: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });
    },

    transaction: async (_, { id }, { prisma, user }) => {
      requireAuth(user);

      const transaction = await prisma.transaction.findUnique({
        where: { id },
        include: {
          user: { include: { role: true } },
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Cashiers can only view their own transactions
      if (user.role.name === 'cashier' && transaction.userId !== user.id) {
        throw new GraphQLError('Insufficient permissions', {
          extensions: { code: 'FORBIDDEN' }
        });
      }

      return transaction;
    }
  },

  Mutation: {
    recordSale: async (_, { items, paymentMethod = 'cash', customerName, customerEmail, customerMobile }, { prisma, user }) => {
      requireAuth(user);

      // Calculate total and prepare transaction items
      let total = 0;
      const transactionItems = [];

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new GraphQLError(`Product ${item.productId} not found`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        if (product.stock < item.quantity) {
          throw new GraphQLError(`Insufficient stock for ${product.name}`, {
            extensions: { code: 'BAD_USER_INPUT' }
          });
        }

        const subtotal = item.price * item.quantity;
        total += subtotal;

        transactionItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          subtotal
        });
      }

      // Create transaction with items, customer info, and update stock
      const transaction = await prisma.transaction.create({
        data: {
          userId: user.id,
          total,
          paymentMethod,
          customerName,
          customerEmail,
          customerMobile,
          items: {
            create: transactionItems
          }
        },
        include: {
          user: { include: { role: true } },
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Update stock for each product and check for low stock
      for (const item of items) {
        const updatedProduct = await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          },
          include: {
            supplier: true
          }
        });

        // Check if product is now below threshold and send email alert
        if (updatedProduct.stock <= updatedProduct.lowStockThreshold) {
          // Import email service
          const { sendLowStockAlert } = await import('../utils/emailService.js');
          
          // Get manager email from environment or system config
          const managerEmail = process.env.MANAGER_EMAIL;
          
          if (managerEmail) {
            try {
              await sendLowStockAlert(updatedProduct, managerEmail);
              console.log(`✅ Low stock alert email sent to manager for product: ${updatedProduct.name}`);
            } catch (error) {
              console.error(`❌ Failed to send low stock alert email:`, error.message);
            }
          } else {
            console.log('⚠️ Manager email not configured. Skipping low stock email notification.');
          }
        }
      }

      // Create audit log
      await createAuditLog(
        prisma,
        user.id,
        'CREATE',
        'Transaction',
        transaction.id,
        { total, itemCount: items.length }
      );

      return transaction;
    },

    generateReceipt: async (_, { transactionId }, { prisma, user }) => {
      requireAuth(user);

      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: { include: { role: true } },
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Get store info from system config
      const storeNameConfig = await prisma.systemConfig.findUnique({
        where: { key: 'store_name' }
      });

      const storeAddressConfig = await prisma.systemConfig.findUnique({
        where: { key: 'store_address' }
      });

      return {
        transaction,
        storeName: storeNameConfig?.value || 'Smart POS Demo Store',
        storeAddress: storeAddressConfig?.value || '123 Main Street, Business District, City, State 12345',
        receiptNumber: `RCP-${transaction.id.toString().padStart(6, '0')}`
      };
    },

    sendReceiptEmail: async (_, { transactionId, customerEmail }, { prisma, user }) => {
      requireAuth(user);

      // Get transaction with all details
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          user: { include: { role: true } },
          items: {
            include: {
              product: true
            }
          }
        }
      });

      if (!transaction) {
        throw new GraphQLError('Transaction not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      // Get store info
      const storeNameConfig = await prisma.systemConfig.findUnique({
        where: { key: 'store_name' }
      });

      const storeAddressConfig = await prisma.systemConfig.findUnique({
        where: { key: 'store_address' }
      });

      const receiptData = {
        transaction,
        storeName: storeNameConfig?.value || 'Smart POS Demo Store',
        storeAddress: storeAddressConfig?.value || '123 Main Street, Business District, City, State 12345',
        receiptNumber: `RCP-${transaction.id.toString().padStart(6, '0')}`
      };

      // Send email
      const { sendReceiptEmail } = await import('../utils/emailService.js');
      const result = await sendReceiptEmail(receiptData, customerEmail);

      return result;
    }
  }
};
