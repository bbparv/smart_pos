import gql from 'graphql-tag';

export const typeDefs = gql`
  type Role {
    id: Int!
    name: String!
    permissions: [String!]!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: Int!
    email: String!
    name: String!
    role: Role!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Product {
    id: Int!
    name: String!
    sku: String!
    description: String
    price: Float!
    cost: Float!
    stock: Int!
    lowStockThreshold: Int!
    supplier: Supplier!
    createdAt: String!
    updatedAt: String!
  }

  type Supplier {
    id: Int!
    name: String!
    contact: String!
    email: String!
    phone: String!
    address: String
    products: [Product!]!
    createdAt: String!
    updatedAt: String!
  }

  type Transaction {
    id: Int!
    user: User!
    total: Float!
    items: [TransactionItem!]!
    paymentMethod: String!
    customerName: String
    customerEmail: String
    customerMobile: String
    createdAt: String!
  }

  type TransactionItem {
    id: Int!
    product: Product!
    quantity: Int!
    price: Float!
    subtotal: Float!
  }

  type Order {
    id: Int!
    supplier: Supplier!
    status: String!
    items: [OrderItem!]!
    total: Float!
    approvedBy: User
    approvedAt: String
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    id: Int!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    subtotal: Float!
  }

  type EmailResponse {
    success: Boolean!
    message: String!
  }

  type AuditLog {
    id: Int!
    user: User!
    action: String!
    entity: String!
    entityId: Int
    changes: String
    timestamp: String!
  }

  type SystemConfig {
    id: Int!
    key: String!
    value: String!
    updatedBy: User!
    updatedAt: String!
    createdAt: String!
  }

  type SalesAnalytics {
    totalSales: Float!
    totalTransactions: Int!
    averageTransaction: Float!
    topProducts: [ProductSales!]!
    salesByDay: [DailySales!]!
  }

  type ProductSales {
    product: Product!
    totalQuantity: Int!
    totalRevenue: Float!
  }

  type DailySales {
    date: String!
    total: Float!
    transactions: Int!
  }

  type InventoryAnalytics {
    totalProducts: Int!
    lowStockProducts: Int!
    totalValue: Float!
    turnoverRate: Float!
  }

  type Receipt {
    transaction: Transaction!
    storeName: String!
    storeAddress: String!
    receiptNumber: String!
  }

  # Inputs
  input RegisterInput {
    email: String!
    password: String!
    name: String!
    roleId: Int!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    sku: String!
    description: String
    price: Float!
    cost: Float!
    stock: Int!
    lowStockThreshold: Int!
    supplierId: Int!
  }

  input SupplierInput {
    name: String!
    contact: String!
    email: String!
    phone: String!
    address: String
  }

  input TransactionItemInput {
    productId: Int!
    quantity: Int!
    price: Float!
  }

  input OrderItemInput {
    productId: Int!
    quantity: Int!
    unitPrice: Float!
  }

  input SystemConfigInput {
    key: String!
    value: String!
  }

  # Queries
  type Query {
    # Auth
    currentUser: User

    # Products
    products: [Product!]!
    product(id: Int!): Product
    lowStockProducts: [Product!]!

    # Suppliers
    suppliers: [Supplier!]!
    supplier(id: Int!): Supplier

    # Transactions
    transactions(limit: Int, offset: Int): [Transaction!]!
    transaction(id: Int!): Transaction

    # Orders
    orders(status: String): [Order!]!
    order(id: Int!): Order

    # Users
    users: [User!]!
    user(id: Int!): User

    # Roles
    roles: [Role!]!

    # Analytics
    salesAnalytics(startDate: String, endDate: String): SalesAnalytics!
    inventoryAnalytics: InventoryAnalytics!

    # Audit Logs
    auditLogs(limit: Int, offset: Int, entity: String): [AuditLog!]!

    # System Config
    systemConfigs: [SystemConfig!]!
    systemConfig(key: String!): SystemConfig
  }

  # Mutations
  type Mutation {
    # Auth
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    # Products
    createProduct(input: ProductInput!): Product!
    updateProduct(id: Int!, input: ProductInput!): Product!
    deleteProduct(id: Int!): Boolean!
    updateStock(id: Int!, quantity: Int!): Product!

    # Suppliers
    createSupplier(input: SupplierInput!): Supplier!
    updateSupplier(id: Int!, input: SupplierInput!): Supplier!
    deleteSupplier(id: Int!): Boolean!

    # POS
    recordSale(items: [TransactionItemInput!]!, paymentMethod: String, customerName: String, customerEmail: String, customerMobile: String): Transaction!
    generateReceipt(transactionId: Int!): Receipt!
    sendReceiptEmail(transactionId: Int!, customerEmail: String!): EmailResponse!

    # Orders
    createOrder(supplierId: Int!, items: [OrderItemInput!]!): Order!
    approveOrder(id: Int!): Order!
    updateOrderStatus(id: Int!, status: String!): Order!

    # Admin
    createUser(input: RegisterInput!): User!
    updateUserRole(userId: Int!, roleId: Int!): User!
    deleteUser(id: Int!): Boolean!
    setSystemConfig(input: SystemConfigInput!): SystemConfig!

    # Roles
    createRole(name: String!, permissions: [String!]!): Role!
  }
`;
