import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from './graphql/schema.js';
import { resolvers } from './resolvers/index.js';
import { getUserFromToken } from './utils/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(bodyParser.json());

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  }
});

// Start server
await server.start();

// Apply Apollo middleware
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      // Get token from Authorization header
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      
      // Get user from token
      const user = await getUserFromToken(token, prisma);

      return {
        prisma,
        user
      };
    }
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 Health check at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
