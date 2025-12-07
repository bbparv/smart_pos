import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function loadDummyData() {
  console.log('🚀 Loading dummy data...\n');

  try {
    // Check if users exist
    const users = await prisma.user.findMany({
      include: { role: true }
    });

    if (users.length === 0) {
      console.log('❌ No users found!');
      console.log('Please create users first by running:');
      console.log('   node scripts/createUsers.js');
      console.log('   Then run the SQL output in your database.\n');
      return;
    }

    console.log(`✓ Found ${users.length} users:`);
    users.forEach(u => console.log(`  - ${u.email} (${u.role.name})`));
    console.log('');

    // Get user IDs by role
    const cashier = users.find(u => u.role.name === 'cashier');
    const manager = users.find(u => u.role.name === 'manager');
    const admin = users.find(u => u.role.name === 'admin');

    if (!cashier || !manager || !admin) {
      console.log('❌ Missing required roles!');
      console.log('Need: cashier, manager, and admin users');
      return;
    }

    // 1. Create Suppliers
    console.log('📦 Creating suppliers...');
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'TechWorld Distributors',
          contact: 'John Smith',
          email: 'john@techworld.com',
          phone: '+1-555-0101',
          address: '123 Tech Street, Silicon Valley, CA'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Global Electronics Inc',
          contact: 'Sarah Johnson',
          email: 'sarah@globalelec.com',
          phone: '+1-555-0102',
          address: '456 Electronics Ave, New York, NY'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Office Supplies Co',
          contact: 'Mike Davis',
          email: 'mike@officesupplies.com',
          phone: '+1-555-0103',
          address: '789 Business Blvd, Chicago, IL'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Premium Goods Ltd',
          contact: 'Emily Chen',
          email: 'emily@premiumgoods.com',
          phone: '+1-555-0104',
          address: '321 Quality Road, Seattle, WA'
        }
      }),
      prisma.supplier.create({
        data: {
          name: 'Budget Wholesale',
          contact: 'David Brown',
          email: 'david@budgetwholesale.com',
          phone: '+1-555-0105',
          address: '654 Discount Lane, Austin, TX'
        }
      })
    ]);
    console.log(`✓ Created ${suppliers.length} suppliers\n`);

    // 2. Create Products
    console.log('🛍️  Creating products...');
    const products = await Promise.all([
      // Electronics
      prisma.product.create({
        data: {
          name: 'Wireless Mouse',
          sku: 'TECH-001',
          description: 'Ergonomic wireless mouse with USB receiver',
          price: 29.99,
          cost: 15.00,
          stock: 45,
          lowStockThreshold: 10,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'USB-C Cable 6ft',
          sku: 'TECH-002',
          description: 'High-speed USB-C charging cable',
          price: 12.99,
          cost: 6.50,
          stock: 120,
          lowStockThreshold: 20,
          supplierId: suppliers[0].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Bluetooth Keyboard',
          sku: 'TECH-003',
          description: 'Slim wireless keyboard with backlight',
          price: 59.99,
          cost: 30.00,
          stock: 25,
          lowStockThreshold: 8,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Laptop Stand',
          sku: 'TECH-004',
          description: 'Adjustable aluminum laptop stand',
          price: 39.99,
          cost: 20.00,
          stock: 35,
          lowStockThreshold: 10,
          supplierId: suppliers[1].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Webcam HD 1080p',
          sku: 'TECH-005',
          description: 'Full HD webcam with built-in microphone',
          price: 79.99,
          cost: 40.00,
          stock: 18,
          lowStockThreshold: 5,
          supplierId: suppliers[0].id
        }
      }),
      // Office Supplies
      prisma.product.create({
        data: {
          name: 'Ballpoint Pens (12pk)',
          sku: 'OFF-001',
          description: 'Blue ink ballpoint pens, pack of 12',
          price: 8.99,
          cost: 4.00,
          stock: 200,
          lowStockThreshold: 30,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Sticky Notes Set',
          sku: 'OFF-002',
          description: 'Assorted colors sticky notes, 6 pads',
          price: 6.99,
          cost: 3.00,
          stock: 150,
          lowStockThreshold: 25,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'A4 Paper Ream',
          sku: 'OFF-003',
          description: '500 sheets premium white A4 paper',
          price: 9.99,
          cost: 5.00,
          stock: 80,
          lowStockThreshold: 15,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Stapler Heavy Duty',
          sku: 'OFF-004',
          description: 'Metal stapler with 1000 staples',
          price: 15.99,
          cost: 8.00,
          stock: 40,
          lowStockThreshold: 10,
          supplierId: suppliers[2].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'File Folders (25pk)',
          sku: 'OFF-005',
          description: 'Manila file folders, letter size',
          price: 12.99,
          cost: 6.50,
          stock: 60,
          lowStockThreshold: 15,
          supplierId: suppliers[2].id
        }
      }),
      // Premium Items
      prisma.product.create({
        data: {
          name: 'Leather Notebook',
          sku: 'PREM-001',
          description: 'Premium leather-bound journal, 200 pages',
          price: 34.99,
          cost: 18.00,
          stock: 30,
          lowStockThreshold: 8,
          supplierId: suppliers[3].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Executive Pen Set',
          sku: 'PREM-002',
          description: 'Gold-plated pen and pencil set with case',
          price: 89.99,
          cost: 45.00,
          stock: 15,
          lowStockThreshold: 5,
          supplierId: suppliers[3].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Designer Desk Lamp',
          sku: 'PREM-003',
          description: 'Modern LED desk lamp with touch control',
          price: 69.99,
          cost: 35.00,
          stock: 22,
          lowStockThreshold: 6,
          supplierId: suppliers[3].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Wireless Charger',
          sku: 'PREM-004',
          description: 'Fast wireless charging pad for phones',
          price: 44.99,
          cost: 22.00,
          stock: 28,
          lowStockThreshold: 8,
          supplierId: suppliers[1].id
        }
      }),
      // Budget Items
      prisma.product.create({
        data: {
          name: 'Basic Calculator',
          sku: 'BUD-001',
          description: '12-digit desktop calculator',
          price: 9.99,
          cost: 4.50,
          stock: 100,
          lowStockThreshold: 20,
          supplierId: suppliers[4].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Plastic Ruler Set',
          sku: 'BUD-002',
          description: 'Set of 3 rulers (6", 12", 18")',
          price: 4.99,
          cost: 2.00,
          stock: 180,
          lowStockThreshold: 30,
          supplierId: suppliers[4].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Eraser Pack',
          sku: 'BUD-003',
          description: 'White erasers, pack of 6',
          price: 3.99,
          cost: 1.50,
          stock: 220,
          lowStockThreshold: 40,
          supplierId: suppliers[4].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Pencil Set (24pk)',
          sku: 'BUD-004',
          description: 'HB pencils with erasers, 24 pack',
          price: 7.99,
          cost: 3.50,
          stock: 140,
          lowStockThreshold: 25,
          supplierId: suppliers[4].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Paper Clips Box',
          sku: 'BUD-005',
          description: '1000 standard paper clips',
          price: 5.99,
          cost: 2.50,
          stock: 160,
          lowStockThreshold: 30,
          supplierId: suppliers[4].id
        }
      }),
      prisma.product.create({
        data: {
          name: 'Highlighter Set',
          sku: 'BUD-006',
          description: '6 fluorescent colors highlighters',
          price: 8.99,
          cost: 4.00,
          stock: 95,
          lowStockThreshold: 20,
          supplierId: suppliers[4].id
        }
      })
    ]);
    console.log(`✓ Created ${products.length} products\n`);

    // 3. Create System Config
    console.log('⚙️  Creating system configuration...');
    await prisma.systemConfig.createMany({
      data: [
        { key: 'store_name', value: 'Smart POS Demo Store', updatedById: admin.id },
        { key: 'store_address', value: '123 Main Street, Business District, City, State 12345', updatedById: admin.id },
        { key: 'tax_rate', value: '8.5', updatedById: admin.id },
        { key: 'currency', value: 'USD', updatedById: admin.id },
        { key: 'receipt_footer', value: 'Thank you for your business!', updatedById: admin.id }
      ]
    });
    console.log('✓ System configuration created\n');

    console.log('🎉 Dummy data loaded successfully!\n');
    console.log('Summary:');
    console.log(`  - ${suppliers.length} suppliers`);
    console.log(`  - ${products.length} products`);
    console.log(`  - 5 system configurations`);
    console.log('\nRefresh your browser to see the data!');

  } catch (error) {
    console.error('❌ Error loading dummy data:', error.message);
    console.error('\nFull error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

loadDummyData();
