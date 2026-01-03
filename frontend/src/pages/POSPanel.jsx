import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  FormControl,
  InputLabel,
  Input
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Logout as LogoutIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      sku
      price
      stock
      cost
      lowStockThreshold
      supplier {
        id
        name
      }
    }
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

const RECORD_SALE_MUTATION = gql`
  mutation RecordSale($items: [TransactionItemInput!]!, $paymentMethod: String, $customerName: String, $customerEmail: String, $customerMobile: String) {
    recordSale(items: $items, paymentMethod: $paymentMethod, customerName: $customerName, customerEmail: $customerEmail, customerMobile: $customerMobile) {
      id
      total
      customerName
      customerEmail
      customerMobile
      createdAt
    }
  }
`;

const GENERATE_RECEIPT_MUTATION = gql`
  mutation GenerateReceipt($transactionId: Int!) {
    generateReceipt(transactionId: $transactionId) {
      transaction {
        id
        total
        customerName
        customerEmail
        customerMobile
        createdAt
        items {
          product {
            name
          }
          quantity
          price
          subtotal
        }
      }
      storeName
      storeAddress
      receiptNumber
    }
  }
`;

const SEND_RECEIPT_EMAIL_MUTATION = gql`
  mutation SendReceiptEmail($transactionId: Int!, $customerEmail: String!) {
    sendReceiptEmail(transactionId: $transactionId, customerEmail: $customerEmail) {
      success
      message
    }
  }
`;

export const POSPanel = () => {
  const { user, logout } = useAuth();
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [receipt, setReceipt] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: ''
  });
  const [orderDialog, setOrderDialog] = useState(false);
  const [reorderProduct, setReorderProduct] = useState(null);

  const { data, loading } = useQuery(PRODUCTS_QUERY);

  const [createOrder] = useMutation(CREATE_ORDER_MUTATION, {
    onCompleted: () => {
      setOrderDialog(false);
      setSuccessMessage('Order created successfully');
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  });

  const [sendReceiptEmailMutation, { loading: emailLoading }] = useMutation(SEND_RECEIPT_EMAIL_MUTATION);

  const [recordSale] = useMutation(RECORD_SALE_MUTATION, {
    onCompleted: async (data) => {
      // Generate receipt
      const result = await generateReceipt({
        variables: { transactionId: data.recordSale.id }
      });
      setReceipt(result.data.generateReceipt);
      setShowReceipt(true);
      setCart([]);
      
      // Automatically send email if customer email exists
      if (data.recordSale.customerEmail) {
        try {
          const emailResult = await sendReceiptEmailMutation({
            variables: {
              transactionId: data.recordSale.id,
              customerEmail: data.recordSale.customerEmail
            }
          });
          
          if (emailResult.data.sendReceiptEmail.success) {
            setSuccessMessage(`Sale recorded! Receipt sent to ${data.recordSale.customerEmail}`);
          } else {
            setSuccessMessage('Sale recorded! Failed to send email.');
          }
        } catch (error) {
          console.error('Error sending receipt email:', error);
          setSuccessMessage('Sale recorded! Failed to send email.');
        }
      } else {
        setSuccessMessage('Sale recorded successfully!');
      }
      
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  });

  const [generateReceipt] = useMutation(GENERATE_RECEIPT_MUTATION);

  const filteredProducts = data?.products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        stock: product.stock
      }]);
    }
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)) }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCustomerDialog(true);
  };

  const handleCustomerSubmit = () => {
    const items = cart.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }));

    recordSale({
      variables: { 
        items, 
        paymentMethod,
        customerName: customerInfo.name || null,
        customerEmail: customerInfo.email || null,
        customerMobile: customerInfo.mobile || null
      }
    });
    setShowCustomerDialog(false);
    setCustomerInfo({ name: '', email: '' });
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

  const printReceipt = () => {
    window.print();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <CartIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            POS Terminal - {user?.name}
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

        <Grid container spacing={3}>
          {/* Products Section */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Products
              </Typography>
              <TextField
                fullWidth
                label="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
              />
              <Box sx={{ mt: 2, maxHeight: '60vh', overflow: 'auto' }}>
                <Grid container spacing={2}>
                  {filteredProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {product.sku}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                            £{product.price.toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color={product.stock < 10 ? 'error' : 'text.secondary'}>
                            Stock: {product.stock}
                          </Typography>
                          <Button
                            fullWidth
                            variant="contained"
                            size="small"
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            sx={{ mt: 1 }}
                          >
                            Add to Cart
                          </Button>
                          {product.stock <= product.lowStockThreshold && (
                            <Button
                              fullWidth
                              variant="outlined"
                              color="warning"
                              size="small"
                              onClick={() => {
                                setReorderProduct(product);
                                setOrderDialog(true);
                              }}
                              sx={{ mt: 1 }}
                            >
                              Reorder
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Cart Section */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h5" gutterBottom>
                Cart
              </Typography>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.map(item => (
                      <TableRow key={item.productId}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton size="small" onClick={() => updateQuantity(item.productId, -1)}>
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                            <IconButton size="small" onClick={() => updateQuantity(item.productId, 1)}>
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell align="right">£{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">£{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => removeFromCart(item.productId)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="h4" align="right" gutterBottom>
                  Total: £{calculateTotal().toFixed(2)}
                </Typography>
                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  SelectProps={{ native: true }}
                  margin="normal"
                >
                  <option value="cash">Cash</option>
                </TextField>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  sx={{ mt: 2 }}
                >
                  Complete Sale
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onClose={() => setShowReceipt(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <ReceiptIcon sx={{ mr: 1 }} />
            Receipt
          </Box>
        </DialogTitle>
        <DialogContent>
          {receipt && (
            <Box id="receipt-content">
              <Typography variant="h6" align="center">{receipt.storeName}</Typography>
              <Typography variant="body2" align="center" gutterBottom>
                {receipt.storeAddress}
              </Typography>
              <Typography variant="body2" align="center" gutterBottom>
                Receipt: {receipt.receiptNumber}
              </Typography>
              <Typography variant="caption" display="block" align="center" gutterBottom>
                {new Date(parseInt(receipt.transaction.createdAt)).toLocaleString()}
              </Typography>

              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell align="center">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {receipt.transaction.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.product.name}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">£{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">£{item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Total: £{receipt.transaction.total.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceipt(false)}>Close</Button>
          <Button onClick={printReceipt} variant="contained">Print</Button>
        </DialogActions>
      </Dialog>

      {/* Customer Info Dialog */}
      <Dialog open={showCustomerDialog} onClose={() => setShowCustomerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Customer Information (Optional)</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              margin="normal"
              helperText="Required for email receipt"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
          <Button onClick={handleCustomerSubmit} variant="contained">Complete Sale</Button>
        </DialogActions>
      </Dialog>
      <OrderDialog
        open={orderDialog}
        onClose={() => {
          setOrderDialog(false);
          setReorderProduct(null);
        }}
        onSubmit={handleOrderSubmit}
        suppliers={reorderProduct ? [reorderProduct.supplier] : []}
        products={data?.products || []}
        reorderProduct={reorderProduct}
      />
    </Box>
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
    
    // Validate total is not zero
    const total = calculateTotal();
    if (total <= 0) {
      alert('Order total must be greater than zero');
      return;
    }
    
    // Validate all quantities and prices are positive
    const hasInvalidItems = formData.items.some(item => {
      const qty = parseFloat(item.quantity);
      const price = parseFloat(item.unitPrice);
      return qty <= 0 || price <= 0;
    });
    
    if (hasInvalidItems) {
      alert('All quantities and prices must be greater than zero');
      return;
    }
    
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
            InputLabelProps={{ shrink: true }}
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
                InputLabelProps={{ shrink: true }}
                margin="dense"
                required
                disabled={!formData.supplierId}
                helperText={!formData.supplierId ? "Please select a supplier first" : ""}
              >
                <option value="" disabled>Select Product</option>
                {products
                  .filter(product => product.supplier?.id === parseInt(formData.supplierId))
                  .map(product => (
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
                  inputProps={{ step: '0.01', min: 0.01 }}
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
              Total: £{calculateTotal().toFixed(2)}
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
