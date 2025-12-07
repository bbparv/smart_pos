import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// USD to INR conversion rate
const CONVERSION_RATE = 83;

async function convertPricesToINR() {
  try {
    console.log('🔄 Converting all product prices from USD to INR...\n');

    // Get all products
    const products = await prisma.product.findMany();

    console.log(`Found ${products.length} products to update\n`);

    // Update each product
    for (const product of products) {
      const oldPrice = product.price;
      const oldCost = product.cost;
      
      const newPrice = Math.round(oldPrice * CONVERSION_RATE);
      const newCost = Math.round(oldCost * CONVERSION_RATE);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: newPrice,
          cost: newCost
        }
      });

      console.log(`✓ ${product.name}`);
      console.log(`  Price: $${oldPrice.toFixed(2)} → ₹${newPrice}`);
      console.log(`  Cost:  $${oldCost.toFixed(2)} → ₹${newCost}\n`);
    }

    console.log('✅ All prices converted to INR successfully!');
    console.log(`\nConversion rate used: 1 USD = ₹${CONVERSION_RATE}`);

  } catch (error) {
    console.error('❌ Error converting prices:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

convertPricesToINR();
