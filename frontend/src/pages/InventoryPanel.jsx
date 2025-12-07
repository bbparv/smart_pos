import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Collapse,
  InputAdornment
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      sku
      description
      price
      cost
      stock
      lowStockThreshold
      supplier {
        id
        name
      }
    }
  }
`;

const SUPPLIERS_QUERY = gql`
  query Suppliers {
    suppliers {
      id
      name
      contact
      email
      phone
      address
    }
  }
`;

const LOW_STOCK_QUERY = gql`
  query LowStockProducts {
    lowStockProducts {
      id
      name
      sku
      cost
      price
      stock
      lowStockThreshold
      supplier {
        id
        name
      }
    }
  }
`;

const ORDERS_QUERY = gql`
  query Orders {
    orders {
      id
      supplier {
        name
      }
      status
      total
      createdAt
      items {
        product {
          name
        }
        quantity
        unitPrice
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: Int!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

const CREATE_SUPPLIER_MUTATION = gql`
  mutation CreateSupplier($input: SupplierInput!) {
    createSupplier(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_SUPPLIER_MUTATION = gql`
  mutation UpdateSupplier($id: Int!, $input: SupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      id
      name
    }
  }
`;

const DELETE_SUPPLIER_MUTATION = gql`
  mutation DeleteSupplier($id: Int!) {
    deleteSupplier(id: $id)
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($supplierId: Int!, $items: [OrderItemInput!]!) {
    createOrder(supplierId: $supplierId, items: $items) {
      id
      status
    }
  }
`;

const APPROVE_ORDER_MUTATION = gql`
  mutation ApproveOrder($id: Int!) {
    approveOrder(id: $id) {
      id
      status
    }
  }
`;

const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: Int!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const InventoryPanel = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [productDialog, setProductDialog] = useState(false);
  const [supplierDialog, setSupplierDialog] = useState(false);
  const [orderDialog, setOrderDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [reorderProduct, setReorderProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const { data: productsData, refetch: refetchProducts } = useQuery(PRODUCTS_QUERY);
  const { data: suppliersData, refetch: refetchSuppliers } = useQuery(SUPPLIERS_QUERY);
  const { data: lowStockData, refetch: refetchLowStock } = useQuery(LOW_STOCK_QUERY);
  const { data: ordersData, refetch: refetchOrders } = useQuery(ORDERS_QUERY);

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetchProducts();
      setProductDialog(false);
      setEditingProduct(null);
      showSuccess('Product created successfully');
    }
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetchProducts();
      setProductDialog(false);
      setEditingProduct(null);
      showSuccess('Product updated successfully');
    }
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      refetchProducts();
      showSuccess('Product deleted successfully');
    }
  });

  const [createSupplier] = useMutation(CREATE_SUPPLIER_MUTATION, {
    onCompleted: () => {
      refetchSuppliers();
      setSupplierDialog(false);
      setEditingSupplier(null);
      showSuccess('Supplier created successfully');
    }
  });

  const [updateSupplier] = useMutation(UPDATE_SUPPLIER_MUTATION, {
    onCompleted: () => {
      refetchSuppliers();
      setSupplierDialog(false);
      setEditingSupplier(null);
      showSuccess('Supplier updated successfully');
    }
  });

  const [deleteSupplier] = useMutation(DELETE_SUPPLIER_MUTATION, {
    onCompleted: () => {
      refetchSuppliers();
      showSuccess('Supplier deleted successfully');
    }
  });

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    onCompleted: () => {
      refetchOrders();
      setOrderDialog(false);
      showSuccess('Order created successfully');
    }
  });

  const [approveOrder] = useMutation(APPROVE_ORDER_MUTATION, {
    onCompleted: () => {
      refetchOrders();
      showSuccess('Order approved successfully');
    }
  });

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS_MUTATION, {
    onCompleted: () => {
      refetchOrders();
      refetchProducts();
      refetchLowStock();
      showSuccess('Order status updated');
    }
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProductSubmit = (formData) => {
    const input = {
      name: formData.name,
      sku: formData.sku,
      description: formData.description || '',
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      supplierId: parseInt(formData.supplierId)
    };

    if (editingProduct) {
      updateProduct({ variables: { id: editingProduct.id, input } });
    } else {
      createProduct({ variables: { input } });
    }
  };

  const handleSupplierSubmit = (formData) => {
    const input = {
      name: formData.name,
      contact: formData.contact,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || ''
    };

    if (editingSupplier) {
      updateSupplier({ variables: { id: editingSupplier.id, input } });
    } else {
      createSupplier({ variables: { input } });
    }
  };

  const handleOrderSubmit = (formData) => {
    createOrder({
      variables: {
        supplierId: parseInt(formData.supplierId),
        items: formData.items.map(item => ({
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice)
        }))
      }
    });
  };

  // Calculate low stock count for badge
  const lowStockCount = lowStockData?.lowStockProducts?.length || 0;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management - {user?.name}
          </Typography>
          <Chip label={user?.role.name} color="secondary" sx={{ mr: 2 }} />
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
            <Tab label="Products" />
            <Tab label="Suppliers" />
            <Tab 
              label={
                <Badge badgeContent={lowStockCount} color="error">
                  Low Stock Alerts
                </Badge>
              } 
            />
            <Tab label="Orders" />
          </Tabs>

          {/* Products Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Products</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    size="small"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 250 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setEditingProduct(null);
                      setProductDialog(true);
                    }}
                  >
                    Add Product
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {productsData?.products
                      .filter(product => 
                        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.supplier.name.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.supplier.name}</TableCell>
                        <TableCell align="right">₹{product.cost.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{product.price.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={product.stock}
                            color={product.stock <= product.lowStockThreshold ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingProduct(product);
                              setProductDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm('Delete this product?')) {
                                deleteProduct({ variables: { id: product.id } });
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Suppliers Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Suppliers</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    size="small"
                    placeholder="Search suppliers..."
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 250 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setSupplierDialog(true)}
                  >
                    Add Supplier
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {suppliersData?.suppliers
                      .filter(supplier =>
                        supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                        supplier.email.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                        supplier.contact.toLowerCase().includes(supplierSearch.toLowerCase())
                      )
                      .map(supplier => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.address}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingSupplier(supplier);
                              setSupplierDialog(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm(`Delete supplier "${supplier.name}"?`)) {
                                deleteSupplier({ variables: { id: supplier.id } });
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Low Stock Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                <WarningIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Low Stock Alerts
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>SKU</TableCell>
                      <TableCell>Product</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell align="right">Current Stock</TableCell>
                      <TableCell align="right">Threshold</TableCell>
                      <TableCell align="center">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockData?.lowStockProducts.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.supplier.name}</TableCell>
                        <TableCell align="right">
                          <Chip label={product.stock} color="error" size="small" />
                        </TableCell>
                        <TableCell align="right">{product.lowStockThreshold}</TableCell>
                        <TableCell align="center">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setReorderProduct(product);
                              setOrderDialog(true);
                            }}
                          >
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Orders Tab */}
          {tabValue === 3 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">Orders</Typography>
                <Box display="flex" gap={2}>
                  <TextField
                    size="small"
                    placeholder="Search orders..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 250 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOrderDialog(true)}
                  >
                    Create Order
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" />
                      <TableCell>Order ID</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ordersData?.orders
                      .filter(order =>
                        order.supplier.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                        order.id.toString().includes(orderSearch) ||
                        order.status.toLowerCase().includes(orderSearch.toLowerCase())
                      )
                      .map(order => (
                      <>
                        <TableRow key={order.id}>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => setExpandedOrders(prev => ({
                                ...prev,
                                [order.id]: !prev[order.id]
                              }))}
                            >
                              {expandedOrders[order.id] ? <ArrowUpIcon /> : <ArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.supplier.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={`${order.items.length} item${order.items.length > 1 ? 's' : ''}`}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={order.status}
                              color={
                                order.status === 'approved' ? 'success' :
                                order.status === 'pending' ? 'warning' :
                                order.status === 'received' ? 'info' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">₹{order.total.toFixed(2)}</TableCell>
                          <TableCell>{new Date(parseInt(order.createdAt)).toLocaleDateString()}</TableCell>
                          <TableCell align="center">
                            {order.status === 'pending' && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => approveOrder({ variables: { id: order.id } })}
                              >
                                Approve
                              </Button>
                            )}
                            {order.status === 'approved' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => updateOrderStatus({ variables: { id: order.id, status: 'sent' } })}
                              >
                                Mark Sent
                              </Button>
                            )}
                            {order.status === 'sent' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => updateOrderStatus({ variables: { id: order.id, status: 'received' } })}
                              >
                                Mark Received
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                            <Collapse in={expandedOrders[order.id]} timeout="auto" unmountOnExit>
                              <Box sx={{ margin: 2, backgroundColor: '#F8FAFC', borderRadius: 2, p: 2 }}>
                                <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
                                  Order Items
                                </Typography>
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell><strong>Product</strong></TableCell>
                                      <TableCell align="right"><strong>Quantity</strong></TableCell>
                                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                                      <TableCell align="right"><strong>Subtotal</strong></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">₹{item.unitPrice.toFixed(2)}</TableCell>
                                        <TableCell align="right">₹{(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Product Dialog */}
      <ProductDialog
        open={productDialog}
        onClose={() => {
          setProductDialog(false);
          setEditingProduct(null);
        }}
        onSubmit={handleProductSubmit}
        product={editingProduct}
        suppliers={suppliersData?.suppliers || []}
      />

      {/* Supplier Dialog */}
      <SupplierDialog
        open={supplierDialog}
        onClose={() => {
          setSupplierDialog(false);
          setEditingSupplier(null);
        }}
        onSubmit={handleSupplierSubmit}
        supplier={editingSupplier}
      />

      {/* Order Dialog */}
      <OrderDialog
        open={orderDialog}
        onClose={() => {
          setOrderDialog(false);
          setReorderProduct(null);
        }}
        onSubmit={handleOrderSubmit}
        suppliers={suppliersData?.suppliers || []}
        products={productsData?.products || []}
        reorderProduct={reorderProduct}
      />
    </Box>
  );
};

// Product Dialog Component
const ProductDialog = ({ open, onClose, onSubmit, product, suppliers }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    lowStockThreshold: '10',
    supplierId: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock: product.stock.toString(),
        lowStockThreshold: product.lowStockThreshold.toString(),
        supplierId: product.supplier.id.toString()
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        price: '',
        cost: '',
        stock: '',
        lowStockThreshold: '10',
        supplierId: ''
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="SKU"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Cost"
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: '0.01' }}
          />
          <TextField
            fullWidth
            label="Price"
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            margin="normal"
            required
            inputProps={{ step: '0.01' }}
          />
          <TextField
            fullWidth
            label="Stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Low Stock Threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Supplier"
            value={formData.supplierId}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            SelectProps={{ native: true }}
            margin="normal"
            required
          >
            <option value="" disabled>Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {product ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Supplier Dialog Component
const SupplierDialog = ({ open, onClose, onSubmit, supplier }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address || ''
      });
    } else {
      setFormData({
        name: '',
        contact: '',
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [supplier]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{supplier ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Supplier Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contact Person"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Order Dialog Component
const OrderDialog = ({ open, onClose, onSubmit, suppliers, products, reorderProduct }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    items: [{ productId: '', quantity: '', unitPrice: '' }]
  });

  // Autofill when reordering a product
  useEffect(() => {
    if (open && reorderProduct) {
      // Autofill form with reorder product details
      setFormData({
        supplierId: reorderProduct.supplier.id.toString(),
        items: [{
          productId: reorderProduct.id.toString(),
          quantity: (reorderProduct.lowStockThreshold - reorderProduct.stock + 10).toString(),
          unitPrice: reorderProduct.cost.toString()
        }]
      });
    } else if (open && !reorderProduct) {
      // Reset form for create order
      setFormData({ supplierId: '', items: [{ productId: '', quantity: '', unitPrice: '' }] });
    }
  }, [reorderProduct, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ supplierId: '', items: [{ productId: '', quantity: '', unitPrice: '' }] });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: '', unitPrice: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unitPrice) || 0;
      return total + (quantity * unitPrice);
    }, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Order</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Supplier"
            value={formData.supplierId}
            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
            SelectProps={{ native: true }}
            margin="normal"
            required
          >
            <option value="" disabled>Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </TextField>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Order Items</Typography>
          
          {formData.items.map((item, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <TextField
                select
                fullWidth
                label="Product"
                value={item.productId}
                onChange={(e) => updateItem(index, 'productId', e.target.value)}
                SelectProps={{ native: true }}
                margin="dense"
                required
              >
                <option value="" disabled>Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </TextField>
              <Box display="flex" gap={2} alignItems="center" sx={{ mt: 1 }}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  inputProps={{ min: 1 }}
                />
                <TextField
                  label="Unit Price"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                  sx={{ flex: 1 }}
                  required
                  inputProps={{ step: '0.01', min: 0 }}
                />
                {formData.items.length > 1 && (
                  <IconButton onClick={() => removeItem(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addItem}
            sx={{ mt: 1 }}
          >
            Add Item
          </Button>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="h6">
              Total: ₹{calculateTotal().toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create Order</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
