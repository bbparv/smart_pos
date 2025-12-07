-- Smart POS - Dummy Data Seed Script
-- Run this after setting up roles and users
-- This will populate the database with sample data for testing

-- ============================================
-- 1. SUPPLIERS (5 suppliers)
-- ============================================
INSERT INTO "Supplier" (name, contact, email, phone, address, "createdAt", "updatedAt") VALUES
('TechWorld Distributors', 'John Smith', 'john@techworld.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA', NOW(), NOW()),
('Global Electronics Inc', 'Sarah Johnson', 'sarah@globalelec.com', '+1-555-0102', '456 Electronics Ave, New York, NY', NOW(), NOW()),
('Office Supplies Co', 'Mike Davis', 'mike@officesupplies.com', '+1-555-0103', '789 Business Blvd, Chicago, IL', NOW(), NOW()),
('Premium Goods Ltd', 'Emily Chen', 'emily@premiumgoods.com', '+1-555-0104', '321 Quality Road, Seattle, WA', NOW(), NOW()),
('Budget Wholesale', 'David Brown', 'david@budgetwholesale.com', '+1-555-0105', '654 Discount Lane, Austin, TX', NOW(), NOW());

-- ============================================
-- 2. PRODUCTS (20 products across categories)
-- ============================================
-- Electronics
INSERT INTO "Product" (name, sku, description, price, cost, stock, "lowStockThreshold", "supplierId", "createdAt", "updatedAt") VALUES
('Wireless Mouse', 'TECH-001', 'Ergonomic wireless mouse with USB receiver', 29.99, 15.00, 45, 10, 1, NOW(), NOW()),
('USB-C Cable 6ft', 'TECH-002', 'High-speed USB-C charging cable', 12.99, 6.50, 120, 20, 1, NOW(), NOW()),
('Bluetooth Keyboard', 'TECH-003', 'Slim wireless keyboard with backlight', 59.99, 30.00, 25, 8, 2, NOW(), NOW()),
('Laptop Stand', 'TECH-004', 'Adjustable aluminum laptop stand', 39.99, 20.00, 35, 10, 2, NOW(), NOW()),
('Webcam HD 1080p', 'TECH-005', 'Full HD webcam with built-in microphone', 79.99, 40.00, 18, 5, 1, NOW(), NOW()),

-- Office Supplies
('Ballpoint Pens (12pk)', 'OFF-001', 'Blue ink ballpoint pens, pack of 12', 8.99, 4.00, 200, 30, 3, NOW(), NOW()),
('Sticky Notes Set', 'OFF-002', 'Assorted colors sticky notes, 6 pads', 6.99, 3.00, 150, 25, 3, NOW(), NOW()),
('A4 Paper Ream', 'OFF-003', '500 sheets premium white A4 paper', 9.99, 5.00, 80, 15, 3, NOW(), NOW()),
('Stapler Heavy Duty', 'OFF-004', 'Metal stapler with 1000 staples', 15.99, 8.00, 40, 10, 3, NOW(), NOW()),
('File Folders (25pk)', 'OFF-005', 'Manila file folders, letter size', 12.99, 6.50, 60, 15, 3, NOW(), NOW()),

-- Premium Items
('Leather Notebook', 'PREM-001', 'Premium leather-bound journal, 200 pages', 34.99, 18.00, 30, 8, 4, NOW(), NOW()),
('Executive Pen Set', 'PREM-002', 'Gold-plated pen and pencil set with case', 89.99, 45.00, 15, 5, 4, NOW(), NOW()),
('Designer Desk Lamp', 'PREM-003', 'Modern LED desk lamp with touch control', 69.99, 35.00, 22, 6, 4, NOW(), NOW()),
('Wireless Charger', 'PREM-004', 'Fast wireless charging pad for phones', 44.99, 22.00, 28, 8, 2, NOW(), NOW()),

-- Budget Items
('Basic Calculator', 'BUD-001', '12-digit desktop calculator', 9.99, 4.50, 100, 20, 5, NOW(), NOW()),
('Plastic Ruler Set', 'BUD-002', 'Set of 3 rulers (6", 12", 18")', 4.99, 2.00, 180, 30, 5, NOW(), NOW()),
('Eraser Pack', 'BUD-003', 'White erasers, pack of 6', 3.99, 1.50, 220, 40, 5, NOW(), NOW()),
('Pencil Set (24pk)', 'BUD-004', 'HB pencils with erasers, 24 pack', 7.99, 3.50, 140, 25, 5, NOW(), NOW()),
('Paper Clips Box', 'BUD-005', '1000 standard paper clips', 5.99, 2.50, 160, 30, 5, NOW(), NOW()),
('Highlighter Set', 'BUD-006', '6 fluorescent colors highlighters', 8.99, 4.00, 95, 20, 5, NOW(), NOW());

-- ============================================
-- 3. SYSTEM CONFIGURATION
-- ============================================
-- Get the first admin user ID (roleId = 3)
DO $$
DECLARE
    admin_user_id INT;
BEGIN
    -- Get the first admin user
    SELECT id INTO admin_user_id FROM "User" WHERE "roleId" = 3 LIMIT 1;
    
    -- If admin exists, insert system config
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO "SystemConfig" (key, value, "updatedById", "createdAt", "updatedAt") VALUES
        ('store_name', 'Smart POS Demo Store', admin_user_id, NOW(), NOW()),
        ('store_address', '123 Main Street, Business District, City, State 12345', admin_user_id, NOW(), NOW()),
        ('tax_rate', '8.5', admin_user_id, NOW(), NOW()),
        ('currency', 'USD', admin_user_id, NOW(), NOW()),
        ('receipt_footer', 'Thank you for your business!', admin_user_id, NOW(), NOW());
        
        RAISE NOTICE 'System configuration created successfully';
    ELSE
        RAISE NOTICE 'No admin user found - skipping system configuration. Create an admin user first.';
    END IF;
END $$;

-- ============================================
-- 4. SAMPLE TRANSACTIONS (10 transactions)
-- ============================================
-- Note: These transactions use dynamic user IDs
-- Transaction 1 - Cashier sale
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 42.98, 'cash', NOW() - INTERVAL '5 days');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(1, 1, 1, 29.99, 29.99),  -- Wireless Mouse
(1, 2, 1, 12.99, 12.99);  -- USB-C Cable

-- Transaction 2
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 156.96, 'card', NOW() - INTERVAL '4 days');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(2, 3, 1, 59.99, 59.99),  -- Bluetooth Keyboard
(2, 4, 1, 39.99, 39.99),  -- Laptop Stand
(2, 6, 2, 8.99, 17.98),   -- Pens
(2, 4, 1, 39.99, 39.99);  -- Laptop Stand

-- Transaction 3
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 89.95, 'cash', NOW() - INTERVAL '3 days');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(3, 8, 5, 9.99, 49.95),   -- A4 Paper
(3, 10, 3, 12.99, 38.97); -- File Folders

-- Transaction 4
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 2 LIMIT 1), 229.96, 'card', NOW() - INTERVAL '2 days');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(4, 5, 2, 79.99, 159.98), -- Webcam
(4, 13, 1, 69.99, 69.99); -- Desk Lamp

-- Transaction 5
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 45.94, 'cash', NOW() - INTERVAL '1 day');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(5, 11, 1, 34.99, 34.99), -- Leather Notebook
(5, 15, 1, 9.99, 9.99);   -- Calculator

-- Transaction 6
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 124.93, 'mobile', NOW() - INTERVAL '12 hours');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(6, 12, 1, 89.99, 89.99), -- Executive Pen Set
(6, 11, 1, 34.99, 34.99); -- Leather Notebook

-- Transaction 7
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 67.92, 'card', NOW() - INTERVAL '6 hours');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(7, 7, 4, 6.99, 27.96),   -- Sticky Notes
(7, 9, 2, 15.99, 31.98),  -- Stapler
(7, 16, 1, 4.99, 4.99);   -- Ruler Set

-- Transaction 8
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 2 LIMIT 1), 189.96, 'cash', NOW() - INTERVAL '3 hours');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(8, 14, 2, 44.99, 89.98), -- Wireless Charger
(8, 3, 1, 59.99, 59.99),  -- Bluetooth Keyboard
(8, 4, 1, 39.99, 39.99);  -- Laptop Stand

-- Transaction 9
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 31.95, 'card', NOW() - INTERVAL '1 hour');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(9, 17, 2, 3.99, 7.98),   -- Erasers
(9, 18, 1, 7.99, 7.99),   -- Pencils
(9, 20, 1, 8.99, 8.99),   -- Highlighters
(9, 6, 1, 6.99, 6.99);    -- Sticky Notes

-- Transaction 10
INSERT INTO "Transaction" ("userId", total, "paymentMethod", "createdAt") VALUES
((SELECT id FROM "User" WHERE "roleId" = 1 LIMIT 1), 144.95, 'cash', NOW() - INTERVAL '30 minutes');

INSERT INTO "TransactionItem" ("transactionId", "productId", quantity, price, subtotal) VALUES
(10, 1, 3, 29.99, 89.97), -- Wireless Mouse
(10, 2, 2, 12.99, 25.98), -- USB-C Cable
(10, 1, 1, 29.99, 29.99); -- Wireless Mouse

-- ============================================
-- 5. SAMPLE ORDERS (5 orders with different statuses)
-- ============================================
-- Order 1 - Pending (needs approval)
INSERT INTO "Order" ("supplierId", status, total, "createdAt", "updatedAt") VALUES
(1, 'pending', 450.00, NOW() - INTERVAL '2 days', NOW());

INSERT INTO "OrderItem" ("orderId", "productId", quantity, "unitPrice", subtotal) VALUES
(1, 1, 20, 15.00, 300.00), -- Wireless Mouse
(1, 5, 5, 30.00, 150.00);  -- Webcam

-- Order 2 - Approved (ready to send)
INSERT INTO "Order" ("supplierId", status, total, "approvedById", "approvedAt", "createdAt", "updatedAt") VALUES
(3, 'approved', 325.00, (SELECT id FROM "User" WHERE "roleId" = 2 LIMIT 1), NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 days', NOW());

INSERT INTO "OrderItem" ("orderId", "productId", quantity, "unitPrice", subtotal) VALUES
(2, 6, 50, 4.00, 200.00),  -- Pens
(2, 8, 25, 5.00, 125.00);  -- A4 Paper

-- Order 3 - Sent (in transit)
INSERT INTO "Order" ("supplierId", status, total, "approvedById", "approvedAt", "createdAt", "updatedAt") VALUES
(2, 'sent', 800.00, (SELECT id FROM "User" WHERE "roleId" = 2 LIMIT 1), NOW() - INTERVAL '5 days', NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day');

INSERT INTO "OrderItem" ("orderId", "productId", quantity, "unitPrice", subtotal) VALUES
(3, 3, 20, 30.00, 600.00), -- Bluetooth Keyboard
(3, 4, 10, 20.00, 200.00); -- Laptop Stand

-- Order 4 - Received (completed)
INSERT INTO "Order" ("supplierId", status, total, "approvedById", "approvedAt", "createdAt", "updatedAt") VALUES
(4, 'received', 540.00, (SELECT id FROM "User" WHERE "roleId" = 2 LIMIT 1), NOW() - INTERVAL '10 days', NOW() - INTERVAL '12 days', NOW() - INTERVAL '7 days');

INSERT INTO "OrderItem" ("orderId", "productId", quantity, "unitPrice", subtotal) VALUES
(4, 11, 15, 18.00, 270.00), -- Leather Notebook
(4, 12, 6, 45.00, 270.00);  -- Executive Pen Set

-- Order 5 - Pending (low stock items)
INSERT INTO "Order" ("supplierId", status, total, "createdAt", "updatedAt") VALUES
(5, 'pending', 280.00, NOW() - INTERVAL '1 hour', NOW());

INSERT INTO "OrderItem" ("orderId", "productId", quantity, "unitPrice", subtotal) VALUES
(5, 15, 40, 4.50, 180.00), -- Calculator
(5, 17, 50, 2.00, 100.00); -- Erasers

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify data was inserted correctly:

-- SELECT COUNT(*) as supplier_count FROM "Supplier";
-- SELECT COUNT(*) as product_count FROM "Product";
-- SELECT COUNT(*) as transaction_count FROM "Transaction";
-- SELECT COUNT(*) as order_count FROM "Order";
-- SELECT SUM(total) as total_sales FROM "Transaction";
-- SELECT name, stock FROM "Product" WHERE stock <= "lowStockThreshold";

-- ============================================
-- NOTES:
-- ============================================
-- 1. This assumes you have 3 users with IDs 1, 2, 3 (admin, manager, cashier)
-- 2. Adjust user IDs in transactions if your setup is different
-- 3. Stock levels will be automatically reduced by transactions
-- 4. Some products are intentionally low stock to test alerts
-- 5. Orders have different statuses to test the workflow
