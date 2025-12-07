import { requireMinRole } from '../middleware/guards.js';

export const analyticsResolvers = {
  Query: {
    salesAnalytics: async (_, { startDate, endDate }, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const where = {};
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      // Get all transactions in date range
      const transactions = await prisma.transaction.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Calculate totals
      const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
      const totalTransactions = transactions.length;
      const averageTransaction = totalTransactions > 0 ? totalSales / totalTransactions : 0;

      // Calculate top products
      const productSales = {};
      transactions.forEach(transaction => {
        transaction.items.forEach(item => {
          if (!productSales[item.productId]) {
            productSales[item.productId] = {
              product: item.product,
              totalQuantity: 0,
              totalRevenue: 0
            };
          }
          productSales[item.productId].totalQuantity += item.quantity;
          productSales[item.productId].totalRevenue += item.subtotal;
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

      // Calculate sales by day
      const salesByDay = {};
      transactions.forEach(transaction => {
        const date = transaction.createdAt.toISOString().split('T')[0];
        if (!salesByDay[date]) {
          salesByDay[date] = {
            date,
            total: 0,
            transactions: 0
          };
        }
        salesByDay[date].total += transaction.total;
        salesByDay[date].transactions += 1;
      });

      const dailySales = Object.values(salesByDay).sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      return {
        totalSales,
        totalTransactions,
        averageTransaction,
        topProducts,
        salesByDay: dailySales
      };
    },

    inventoryAnalytics: async (_, __, { prisma, user }) => {
      requireMinRole(user, 'manager');

      const products = await prisma.product.findMany();

      const totalProducts = products.length;
      const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length;
      const totalValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

      // Simple turnover calculation (could be enhanced with actual sales data)
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const turnoverRate = totalStock > 0 ? (totalProducts / totalStock) * 100 : 0;

      return {
        totalProducts,
        lowStockProducts,
        totalValue,
        turnoverRate
      };
    }
  }
};
