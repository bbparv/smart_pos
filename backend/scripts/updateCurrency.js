import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCurrency() {
  try {
    await prisma.systemConfig.updateMany({
      where: { key: 'currency' },
      data: { value: 'INR' }
    });
    console.log('✓ Currency updated to INR in database');
  } catch (error) {
    console.error('Error updating currency:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateCurrency();
