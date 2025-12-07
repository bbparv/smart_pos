import bcrypt from 'bcryptjs';

// Script to create initial admin user
// Run this after setting up the database and seeding roles

const createAdminUser = async () => {
  const email = 'admin@pos.com';
  const password = 'admin123';
  const name = 'Admin User';
  const roleId = 3; // Admin role

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('========================================');
  console.log('Admin User Creation SQL');
  console.log('========================================');
  console.log('\nRun this SQL in your PostgreSQL client:\n');
  console.log(`INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")`);
  console.log(`VALUES ('${email}', '${hashedPassword}', '${name}', ${roleId}, NOW(), NOW());`);
  console.log('\n========================================');
  console.log('Credentials:');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('========================================\n');

  // Also create manager and cashier users
  const managerPassword = await bcrypt.hash('manager123', 10);
  const cashierPassword = await bcrypt.hash('cashier123', 10);

  console.log('Optional: Create Manager and Cashier users:\n');
  console.log(`-- Manager User`);
  console.log(`INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")`);
  console.log(`VALUES ('manager@pos.com', '${managerPassword}', 'Manager User', 2, NOW(), NOW());`);
  console.log('');
  console.log(`-- Cashier User`);
  console.log(`INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")`);
  console.log(`VALUES ('cashier@pos.com', '${cashierPassword}', 'Cashier User', 1, NOW(), NOW());`);
  console.log('\n========================================\n');
};

createAdminUser();
