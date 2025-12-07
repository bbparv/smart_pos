import { requireMinRole } from '../middleware/guards.js';
import { createAuditLog } from '../utils/auditLog.js';
import { GraphQLError } from 'graphql';

export const inventoryResolvers = {
  Query: {
    products: async (_, __, { prisma, user }) => {
      requireMinRole(user, 'cashier');

      return await prisma.product.findMany({
        include: {
          supplier: true
        },
        orderBy: { name: 'asc' }
      });
    },

    product: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'cashier');

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          supplier: true
        }
      });

      if (!product) {
        throw new GraphQLError('Product not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return product;
    },

    lowStockProducts: async (_, __, { prisma, user }) => {
      requireMinRole(user, 'manager');

      return await prisma.product.findMany({
        where: {
          stock: {
            lte: prisma.product.fields.lowStockThreshold
          }
        },
        include: {
          supplier: true
        },
        orderBy: { stock: 'asc' }
      });
    },

    suppliers: async (_, __, { prisma, user }) => {
      requireMinRole(user, 'manager');

      return await prisma.supplier.findMany({
        include: {
          products: true
        },
        orderBy: { name: 'asc' }
      });
    },

    supplier: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const supplier = await prisma.supplier.findUnique({
        where: { id },
        include: {
          products: true
        }
      });

      if (!supplier) {
        throw new GraphQLError('Supplier not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return supplier;
    }
  },

  Mutation: {
    createProduct: async (_, { input }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const product = await prisma.product.create({
        data: input,
        include: {
          supplier: true
        }
      });

      await createAuditLog(prisma, user.id, 'CREATE', 'Product', product.id, input);

      return product;
    },

    updateProduct: async (_, { id, input }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const product = await prisma.product.update({
        where: { id },
        data: input,
        include: {
          supplier: true
        }
      });

      await createAuditLog(prisma, user.id, 'UPDATE', 'Product', id, input);

      return product;
    },

    deleteProduct: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      await prisma.product.delete({
        where: { id }
      });

      await createAuditLog(prisma, user.id, 'DELETE', 'Product', id);

      return true;
    },

    updateStock: async (_, { id, quantity }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const product = await prisma.product.update({
        where: { id },
        data: {
          stock: quantity
        },
        include: {
          supplier: true
        }
      });

      await createAuditLog(prisma, user.id, 'UPDATE_STOCK', 'Product', id, { newStock: quantity });

      return product;
    },

    createSupplier: async (_, { input }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const supplier = await prisma.supplier.create({
        data: input,
        include: {
          products: true
        }
      });

      await createAuditLog(prisma, user.id, 'CREATE', 'Supplier', supplier.id, input);

      return supplier;
    },

    updateSupplier: async (_, { id, input }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const supplier = await prisma.supplier.update({
        where: { id },
        data: input,
        include: {
          products: true
        }
      });

      await createAuditLog(prisma, user.id, 'UPDATE', 'Supplier', id, input);

      return supplier;
    },

    deleteSupplier: async (_, { id }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      await prisma.supplier.delete({
        where: { id }
      });

      await createAuditLog(prisma, user.id, 'DELETE', 'Supplier', id);

      return true;
    }
  }
};
