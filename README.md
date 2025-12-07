# Smart POS & Inventory-Replenishment Web App

A full-stack Point of Sale and Inventory Management system with role-based access control.

## Features

- **Role-Based Access Control**: Three user roles (Cashier, Manager, Admin) with specific permissions
- **POS Terminal**: Fast checkout, cart management, and receipt generation
- **Inventory Management**: Product and supplier CRUD, low-stock alerts, automated reordering
- **Analytics Dashboard**: Sales reports, top products, inventory metrics
- **Admin Panel**: User management, system configuration, audit logs
- **Real-time Stock Updates**: Automatic stock adjustments on sales and order receipts
- **Docker Support**: Containerized deployment for easy setup
- **Email Alerts**: Automated notifications for low stock and fulfillment (Nodemailer)
- **Payment Integration**: Razorpay integration for subscription payments

## Tech Stack

### Backend
- Node.js + Express
- Apollo Server (GraphQL)
- PostgreSQL + Prisma ORM
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer (Email services)
- Razorpay (Payments)

### Frontend
- React 18
- Material UI (MUI)
- Apollo Client
- React Router v6
- MUI X Charts for analytics
- Vite for build tooling

## Project Structure

```
smart_pos/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.sql
│   ├── src/
│   │   ├── graphql/
│   │   │   └── schema.js
│   │   ├── resolvers/
│   │   │   ├── authResolvers.js
│   │   │   ├── posResolvers.js
│   │   │   ├── inventoryResolvers.js
│   │   │   ├── reorderResolvers.js
│   │   │   ├── analyticsResolvers.js
│   │   │   ├── adminResolvers.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   └── guards.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   └── auditLog.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── config/
    │   │   └── apolloClient.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── POSPanel.jsx
    │   │   ├── InventoryPanel.jsx
    │   │   └── AdminPanel.jsx
    │   ├── App.jsx
    │   └── index.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
copy .env.example .env
```

4. Update `.env` with your PostgreSQL credentials:
```
DATABASE_URL="postgresql://username:password@localhost:5432/smart_pos?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
EMAIL_USER="your_email@example.com"
EMAIL_PASS="your_email_password"

```

5. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

6. Seed the database with default roles:
```bash
psql -U username -d smart_pos -f prisma/seed.sql
```

7. Create a test admin user (using GraphQL Playground or manually):
```sql
INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")
VALUES ('admin@pos.com', '$2a$10$hash_of_admin123', 'Admin User', 3, NOW(), NOW());
```

8. Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:4000/graphql`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Default User Roles

After seeding the database, three roles are created:

1. **Cashier** (roleId: 1)
   - Access to POS terminal
   - Can record sales and view receipts
   - Can view product stock levels

2. **Manager** (roleId: 2)
   - All cashier permissions
   - Product and supplier management
   - Inventory control and reordering
   - Access to analytics

3. **Admin** (roleId: 3)
   - All manager permissions
   - User management
   - System configuration
   - Audit log access
   - Full analytics dashboard

## Usage

1. **Login**: Use the credentials you created or register new users via the admin panel
2. **POS Terminal**: Cashiers can search products, add to cart, and complete sales
3. **Inventory**: Managers can add/edit products, manage suppliers, and create reorder requests
4. **Admin**: Admins can manage users, configure system settings, and view audit logs

## GraphQL API

The GraphQL API is available at `http://localhost:4000/graphql`

### Key Queries
- `currentUser`: Get logged-in user details
- `products`: List all products
- `lowStockProducts`: Get products below threshold
- `transactions`: View sales transactions
- `salesAnalytics`: Get sales reports
- `auditLogs`: View system audit trail

### Key Mutations
- `login`: Authenticate user
- `recordSale`: Process a sale
- `createProduct`: Add new product
- `createOrder`: Create supplier order
- `approveOrder`: Approve pending order
- `setSystemConfig`: Update system settings

## Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcryptjs
- GraphQL resolver-level authorization
- Audit logging for all critical actions

## License

MIT
