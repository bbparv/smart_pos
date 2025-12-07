# Smart POS & Inventory-Replenishment Web App

A full-stack Point of Sale and Inventory Management system with intelligent automation, role-based access control, and comprehensive email notifications.

## 🎯 Overview

Smart POS is a modern, web-based inventory and point-of-sale system designed for small to medium retail businesses. It combines real-time inventory tracking, automated reordering, professional receipt generation, and comprehensive analytics in an easy-to-use interface.

## ✨ Key Features

### 🛒 Point of Sale (POS)
- Fast, intuitive checkout interface
- Real-time product search
- Shopping cart management
- Multiple payment methods (Cash, Card, Mobile Payment)
- **Automated email receipts** with PDF attachments
- Professional receipt generation with Indian currency (₹)
- Customer information capture (optional)

### 📦 Inventory Management
- Complete product CRUD operations
- Supplier management
- **CSV import/export** for products and suppliers
- Low stock alerts with visual indicators
- Real-time stock updates on sales
- **Comprehensive input validation** (price > cost, min quantities, etc.)
- Automated reorder suggestions

### 📧 Email Automation
- **PDF receipt generation** for customers
- **PDF purchase orders** for suppliers
- Low stock alert emails to managers
- Order fulfillment notifications
- Professional HTML email templates
- Configurable SMTP settings

### 📊 Analytics Dashboard
- Sales analytics with charts
- Top-selling products
- Revenue tracking
- Inventory turnover rate
- Low stock products overview
- User-wise audit logs with filtering

### 👥 Role-Based Access Control
Three distinct user roles with specific permissions:

1. **Cashier** (POS Access)
   - Process sales and generate receipts
   - View product information
   - Send customer receipts

2. **Manager** (Inventory Control)
   - All cashier permissions
   - Product and supplier management
   - Create and approve purchase orders
   - View analytics and reports
   - CSV import/export
   - Manage low stock alerts

3. **Admin** (System Administration)
   - All manager permissions
   - User management
   - System configuration
   - Audit log access with filtering
   - Full analytics dashboard

### 🎨 User Interface
- Professional white SaaS theme
- Blue and green accent colors
- Responsive Material-UI design
- Intuitive navigation
- Real-time feedback
- **Green success badges** for completed orders

### ✅ Input Validation
Comprehensive validation across all panels:
- Product: Name (min 2 chars), Cost/Price (>0, price>cost), Stock (>=0)
- Supplier: Name (min 2 chars), Email format, Phone (10 digits)
- Orders: Quantity (>0), Price (>0), Total validation
- User: Name (min 2 chars), Password (min 6 chars)
- Login: Email format, Password (min 6 chars)

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **Apollo Server** - GraphQL API
- **PostgreSQL** - Database
- **Prisma ORM** - Database toolkit
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **PDFKit** - PDF generation

### Frontend
- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **Apollo Client** - GraphQL client
- **React Router v6** - Navigation
- **MUI X Charts** - Analytics visualization
- **Vite** - Build tool
- **react-csv** - CSV import/export

## 📁 Project Structure

```
smart_pos/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.sql               # Initial data
│   ├── src/
│   │   ├── graphql/
│   │   │   └── schema.js          # GraphQL schema
│   │   ├── resolvers/
│   │   │   ├── authResolvers.js   # Authentication
│   │   │   ├── posResolvers.js    # POS operations
│   │   │   ├── inventoryResolvers.js
│   │   │   ├── reorderResolvers.js
│   │   │   ├── analyticsResolvers.js
│   │   │   ├── adminResolvers.js
│   │   │   └── index.js
│   │   ├── middleware/
│   │   │   └── guards.js          # Authorization
│   │   ├── utils/
│   │   │   ├── auth.js            # JWT utilities
│   │   │   ├── auditLog.js        # Audit logging
│   │   │   └── emailService.js    # Email & PDF generation
│   │   └── index.js               # Server entry
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── config/
│   │   │   └── apolloClient.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Home page
│   │   │   ├── Login.jsx          # Authentication
│   │   │   ├── POSPanel.jsx       # Cashier interface
│   │   │   ├── InventoryPanel.jsx # Manager interface
│   │   │   └── AdminPanel.jsx     # Admin interface
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── test-data/                      # Sample CSV files
│   ├── sample_products.csv
│   └── sample_suppliers.csv
│
├── .gitignore
├── README.md
└── Expected_output.md              # Project proposal
```

## 🚀 Setup Instructions

### Prerequisites
- **Node.js 18+** installed
- **PostgreSQL** database running
- **SMTP credentials** (Gmail recommended)
- npm or yarn package manager

### 1. Backend Setup

Navigate to backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create `.env` file from example:
```bash
copy .env.example .env   # Windows
cp .env.example .env     # Linux/Mac
```

Update `.env` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/smart_pos?schema=public"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Email Configuration (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM_NAME="Smart POS"

# Application
FRONTEND_URL="http://localhost:5173"
MANAGER_EMAIL="manager@yourstore.com"
```

**Important**: For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Seed the database with default roles:
```bash
# Windows
psql -U postgres -d smart_pos -f prisma/seed.sql

# Linux/Mac
psql -U username -d smart_pos -f prisma/seed.sql
```

Create demo users:
```sql
-- Admin user (password: admin123)
INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")
VALUES ('admin@pos.com', '$2a$10$YourHashedPasswordHere', 'Admin User', 3, NOW(), NOW());

-- Manager user (password: manager123)
INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")
VALUES ('manager@pos.com', '$2a$10$YourHashedPasswordHere', 'Manager User', 2, NOW(), NOW());

-- Cashier user (password: cashier123)
INSERT INTO "User" (email, password, name, "roleId", "createdAt", "updatedAt")
VALUES ('cashier@pos.com', '$2a$10$YourHashedPasswordHere', 'Cashier User', 1, NOW(), NOW());
```

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:4000/graphql`

### 2. Frontend Setup

Navigate to frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

**Demo Credentials:**
- Admin: `admin@pos.com` / `admin123`
- Manager: `manager@pos.com` / `manager123`
- Cashier: `cashier@pos.com` / `cashier123`

## 📖 Usage Guide

### For Cashiers (POS Panel)
1. Login with cashier credentials
2. Search and add products to cart
3. Enter customer email (optional)
4. Complete sale
5. Receipt automatically emailed with PDF attachment

### For Managers (Inventory Panel)
1. **Products Tab**: Add/edit products, import/export CSV
2. **Suppliers Tab**: Manage suppliers, import/export CSV
3. **Low Stock Alerts**: View items needing reorder
4. **Orders Tab**: Create purchase orders, track status
   - Orders sent to suppliers with PDF attachment
   - Mark orders as received (green success badge)

### For Admins (Admin Panel)
1. **Analytics**: View sales charts and metrics
2. **Users**: Create and manage user accounts
3. **Audit Logs**: Filter and export activity logs
4. **Low Stock Alerts**: Monitor inventory levels

## 📧 Email Features

### Customer Receipts
- Sent automatically after checkout
- Professional HTML email template
- PDF attachment: `receipt_XXXXX.pdf`
- Includes all purchase details
- Uses Indian Rupee (₹) currency

### Purchase Orders
- Sent to suppliers when orders created
- Professional HTML email template
- PDF attachment: `purchase_order_XX.pdf`
- CC to manager email
- Includes delivery instructions

### Low Stock Alerts
- Sent to manager when stock falls below threshold
- Lists product details and current stock
- Suggests reorder quantity

## 📊 GraphQL API

Access GraphQL Playground at `http://localhost:4000/graphql`

### Key Queries
```graphql
# Get current user
query {
  currentUser {
    id
    name
    email
    role { name permissions }
  }
}

# Get all products
query {
  products {
    id
    name
    sku
    price
    stock
    supplier { name }
  }
}

# Get low stock products
query {
  lowStockProducts {
    id
    name
    stock
    lowStockThreshold
  }
}

# Get sales analytics
query {
  salesAnalytics {
    totalSales
    totalRevenue
    topProducts { name totalSold }
  }
}
```

### Key Mutations
```graphql
# Login
mutation {
  login(input: { email: "cashier@pos.com", password: "cashier123" }) {
    token
    user { name role { name } }
  }
}

# Record a sale
mutation {
  recordSale(
    items: [{ productId: 1, quantity: 2, price: 29.99 }]
    paymentMethod: "cash"
    customerEmail: "customer@example.com"
  ) {
    id
    total
  }
}

# Create purchase order
mutation {
  createOrder(
    supplierId: 1
    items: [{ productId: 1, quantity: 10, unitPrice: 15.50 }]
  ) {
    id
    status
  }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **Role-Based Access Control**: Granular permissions
- **GraphQL Guards**: Resolver-level authorization
- **Audit Logging**: Track all critical actions
- **Input Validation**: Comprehensive client & server-side
- **HTTPS Ready**: Production-ready security

## 🧪 Testing

### CSV Import Testing
1. Navigate to `test-data/` folder
2. Use `sample_products.csv` and `sample_suppliers.csv`
3. Import suppliers first, then products
4. Verify data appears in tables

### Email Testing
1. Configure SMTP in `.env`
2. Complete a sale with customer email
3. Check inbox for receipt with PDF
4. Create a purchase order
5. Check supplier email for order PDF

### Validation Testing
- Try entering invalid data in forms
- Verify error messages appear
- Check helper text displays correctly

## 🎨 UI Theme

- **Primary Color**: Blue (#2563EB)
- **Success Color**: Green (#10B981)
- **Warning Color**: Yellow (#F59E0B)
- **Error Color**: Red (#EF4444)
- **Background**: White (#FFFFFF)
- **Text**: Dark Gray (#0F172A)

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for small retail businesses**
