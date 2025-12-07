import { authResolvers } from './authResolvers.js';
import { posResolvers } from './posResolvers.js';
import { inventoryResolvers } from './inventoryResolvers.js';
import { reorderResolvers } from './reorderResolvers.js';
import { analyticsResolvers } from './analyticsResolvers.js';
import { adminResolvers } from './adminResolvers.js';

export const resolvers = {
  Query: {
    ...authResolvers.Query,
    ...posResolvers.Query,
    ...inventoryResolvers.Query,
    ...reorderResolvers.Query,
    ...analyticsResolvers.Query,
    ...adminResolvers.Query
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...posResolvers.Mutation,
    ...inventoryResolvers.Mutation,
    ...reorderResolvers.Mutation,
    ...analyticsResolvers.Mutation,
    ...adminResolvers.Mutation
  }
};
