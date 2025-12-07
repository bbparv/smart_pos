import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Correct INR prices for all products
const correctPrices = {
  'Wireless Mouse': { price: 2500, cost: 1245 },
  'USB-C Cable 6ft': { price: 1100, cost: 540 },
  'Bluetooth Keyboard': { price: 5000, cost: 2490 },
  'Laptop Stand': { price: 3300, cost: 1660 },
  'Webcam HD 1080p': { price: 6600, cost: 3320 },
  'Ballpoint Pens (12pk)': { price: 750, cost: 332 },
  'Sticky Notes Set': { price: 600, cost: 249 },
  'A4 Paper Ream': { price: 850, cost: 415 },
  'Stapler Heavy Duty': { price: 1350, cost: 664 },
  'File Folders (25pk)': { price: 1100, cost: 540 },
  'Leather Notebook': { price: 2900, cost: 1494 },
  'Executive Pen Set': { price: 7500, cost: 3735 },
  'Designer Desk Lamp': { price: 5800, cost: 2905 },
  'Wireless Charger': { price: 3700, cost: 1826 },
  'Basic Calculator': { price: 850, cost: 374 },
  'Plastic Ruler Set': { price: 400, cost: 166 },
  'Eraser Pack': { price: 350, cost: 125 },
  'Pencil Set (24pk)': { price: 650, cost: 291 },
  'Paper Clips Box': { price: 500, cost: 208 },
  'Highlighter Set': { price: 750, cost: 332 },
  'Blue Gel Pens (10pk)': { price: 750, cost: 332 }
};

async function fixAllPrices() {
  try {
    console.log('🔧 Fixing all product prices to correct INR values...\n');

    let updated = 0;

    for (const [productName, prices] of Object.entries(correctPrices)) {
      const result = await prisma.product.updateMany({
        where: {
          name: productName
        },
        data: {
          price: prices.price,
          cost: prices.cost
        }
      });

      if (result.count > 0) {
        console.log(`✓ ${productName}: ₹${prices.price} (cost: ₹${prices.cost})`);
        updated++;
      }
    }

    console.log(`\n✅ Fixed ${updated} products with correct INR prices!`);
    console.log('\nRefresh your browser to see the updated prices.');

  } catch (error) {
    console.error('❌ Error fixing prices:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAllPrices();
