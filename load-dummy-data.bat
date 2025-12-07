@echo off
echo ========================================
echo Smart POS - Load Dummy Data
echo ========================================
echo.
echo This will populate your database with:
echo - 5 Suppliers
echo - 20 Products
echo - 10 Sample Transactions
echo - 5 Sample Orders
echo - System Configuration
echo.
echo Make sure you have:
echo 1. PostgreSQL running
echo 2. Database 'smart_pos' created
echo 3. Migrations run
echo 4. Users created
echo.
pause
echo.
echo ========================================
echo Loading Dummy Data...
echo ========================================
echo.

set /p PGUSER="Enter PostgreSQL username (default: postgres): " || set PGUSER=postgres
set /p PGDB="Enter database name (default: smart_pos): " || set PGDB=smart_pos

echo.
echo Running SQL script...
psql -U %PGUSER% -d %PGDB% -f backend\prisma\seed-dummy-data.sql

echo.
echo ========================================
echo Verification
echo ========================================
echo.
echo Checking data counts...
psql -U %PGUSER% -d %PGDB% -c "SELECT 'Suppliers: ' || COUNT(*) FROM \"Supplier\";"
psql -U %PGUSER% -d %PGDB% -c "SELECT 'Products: ' || COUNT(*) FROM \"Product\";"
psql -U %PGUSER% -d %PGDB% -c "SELECT 'Transactions: ' || COUNT(*) FROM \"Transaction\";"
psql -U %PGUSER% -d %PGDB% -c "SELECT 'Orders: ' || COUNT(*) FROM \"Order\";"
psql -U %PGUSER% -d %PGDB% -c "SELECT 'Total Sales: $' || SUM(total) FROM \"Transaction\";"

echo.
echo ========================================
echo Dummy Data Loaded Successfully!
echo ========================================
echo.
echo You can now test:
echo - POS Panel: Search and sell products
echo - Inventory Panel: View products, suppliers, orders
echo - Admin Panel: See analytics with real data
echo.
echo Refresh your browser to see the new data!
echo.
pause
