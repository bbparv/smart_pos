import { requireRole, requireMinRole } from '../middleware/guards.js';
import { createAuditLog } from '../utils/auditLog.js';
import { hashPassword } from '../utils/auth.js';
import { GraphQLError } from 'graphql';

export const adminResolvers = {
  Query: {
    users: async (_, __, { prisma, user }) => {
      requireRole(user, ['admin']);

      return await prisma.user.findMany({
        include: {
          role: true
        },
        orderBy: { createdAt: 'desc' }
      });
    },

    user: async (_, { id }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const targetUser = await prisma.user.findUnique({
        where: { id },
        include: {
          role: true
        }
      });

      if (!targetUser) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      return targetUser;
    },

    roles: async (_, __, { prisma, user }) => {
      requireRole(user, ['admin']);

      return await prisma.role.findMany({
        orderBy: { name: 'asc' }
      });
    },

    auditLogs: async (_, { limit = 100, offset = 0, entity }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const where = entity ? { entity } : {};

      return await prisma.auditLog.findMany({
        where,
        include: {
          user: {
            include: {
              role: true
            }
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip: offset
      });
    },

    systemConfigs: async (_, __, { prisma, user }) => {
      requireRole(user, ['admin']);

      return await prisma.systemConfig.findMany({
        include: {
          updatedBy: {
            include: {
              role: true
            }
          }
        },
        orderBy: { key: 'asc' }
      });
    },

    systemConfig: async (_, { key }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const config = await prisma.systemConfig.findUnique({
        where: { key },
        include: {
          updatedBy: {
            include: {
              role: true
            }
          }
        }
      });

      return config;
    }
  },

  Mutation: {
    createUser: async (_, { input }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const { email, password, name, roleId } = input;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new GraphQLError('User already exists', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          roleId
        },
        include: {
          role: true
        }
      });

      await createAuditLog(prisma, user.id, 'CREATE_USER', 'User', newUser.id, { email, roleId });

      return newUser;
    },

    updateUserRole: async (_, { userId, roleId }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { roleId },
        include: {
          role: true
        }
      });

      await createAuditLog(prisma, user.id, 'UPDATE_ROLE', 'User', userId, { newRoleId: roleId });

      return updatedUser;
    },

    deleteUser: async (_, { id }, { prisma, user }) => {
      requireRole(user, ['admin']);

      // Prevent self-deletion
      if (id === user.id) {
        throw new GraphQLError('Cannot delete your own account', {
          extensions: { code: 'BAD_USER_INPUT' }
        });
      }

      await prisma.user.delete({
        where: { id }
      });

      await createAuditLog(prisma, user.id, 'DELETE_USER', 'User', id);

      return true;
    },

    setSystemConfig: async (_, { input }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const { key, value } = input;

      const config = await prisma.systemConfig.upsert({
        where: { key },
        update: {
          value,
          updatedById: user.id
        },
        create: {
          key,
          value,
          updatedById: user.id
        },
        include: {
          updatedBy: {
            include: {
              role: true
            }
          }
        }
      });

      await createAuditLog(prisma, user.id, 'SET_CONFIG', 'SystemConfig', config.id, { key, value });

      return config;
    },

    createRole: async (_, { name, permissions }, { prisma, user }) => {
      requireRole(user, ['admin']);

      const role = await prisma.role.create({
        data: {
          name,
          permissions
        }
      });

      await createAuditLog(prisma, user.id, 'CREATE_ROLE', 'Role', role.id, { name, permissions });

      return role;
    }
  }
};
