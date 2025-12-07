import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { createAuditLog } from '../utils/auditLog.js';
import { GraphQLError } from 'graphql';

export const authResolvers = {
  Query: {
    currentUser: async (_, __, { user }) => {
      return user;
    }
  },

  Mutation: {
    register: async (_, { input }, { prisma }) => {
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
      const user = await prisma.user.create({
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

      // Generate token
      const token = generateToken(user);

      // Create audit log
      await createAuditLog(prisma, user.id, 'REGISTER', 'User', user.id);

      return {
        token,
        user
      };
    },

    login: async (_, { input }, { prisma }) => {
      const { email, password } = input;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
        include: { role: true }
      });

      if (!user) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Verify password
      const validPassword = await comparePassword(password, user.password);

      if (!validPassword) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      // Generate token
      const token = generateToken(user);

      // Create audit log
      await createAuditLog(prisma, user.id, 'LOGIN', 'User', user.id);

      return {
        token,
        user
      };
    }
  }
};
