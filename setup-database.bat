@echo off
echo ========================================
echo Smart POS Database Setup Helper
echo ========================================
echo.
echo This script will help you set up the PostgreSQL database.
echo.
echo Prerequisites:
echo 1. PostgreSQL must be installed and running
echo 2. You need database credentials (username, password)
echo.
echo ========================================
echo Step 1: Update .env file
echo ========================================
echo.
echo Please edit backend\.env file with your PostgreSQL credentials:
echo.
echo DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/smart_pos?schema=public"
echo.
echo Replace USERNAME and PASSWORD with your PostgreSQL credentials.
echo.
pause
echo.
echo ========================================
echo Step 2: Create Database
echo ========================================
echo.
echo Run this command in PostgreSQL (or pgAdmin):
echo.
echo CREATE DATABASE smart_pos;
echo.
pause
echo.
echo ========================================
echo Step 3: Run Migrations
echo ========================================
echo.
cd backend
echo Running Prisma migrations...
call npx prisma migrate dev --name init
echo.
echo ========================================
echo Step 4: Seed Default Roles
echo ========================================
echo.
echo Please run this SQL in your PostgreSQL client:
echo.
type prisma\seed.sql
echo.
pause
echo.
echo ========================================
echo Step 5: Create Admin User
echo ========================================
echo.
echo After seeding roles, you need to create an admin user.
echo You can do this via GraphQL Playground after starting the server.
echo.
echo Or run this SQL (replace the password hash):
echo.
echo INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")
echo VALUES ('admin@pos.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 3, NOW(), NOW());
echo.
echo To hash a password, you can use an online bcrypt generator or Node.js.
echo.
pause
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm run dev
echo 3. Open http://localhost:5173
echo.
pause
