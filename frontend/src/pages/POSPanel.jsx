import { useState } from 'react';
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
  Receipt as ReceiptIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id
      name
      sku
      price
      stock
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
    email: '',
    mobile: ''
  });

  const { data, loading } = useQuery(PRODUCTS_QUERY);

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
      setSuccessMessage('Sale recorded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
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
    setCustomerInfo({ name: '', email: '', mobile: '' });
  };

  const printReceipt = () => {
    window.print();
  };

  const sendViaEmail = async () => {
    if (!receipt || !receipt.transaction.customerEmail) return;
    
    try {
      const result = await sendReceiptEmailMutation({
        variables: {
          transactionId: receipt.transaction.id,
          customerEmail: receipt.transaction.customerEmail
        }
      });
      
      if (result.data.sendReceiptEmail.success) {
        setSuccessMessage('Receipt sent successfully to ' + receipt.transaction.customerEmail);
      }
    } catch (error) {
      console.error('Error sending receipt email:', error);
      alert('Failed to send receipt email: ' + error.message);
    }
  };

  const sendViaWhatsApp = () => {
    if (!receipt) return;
    
    let mobile = receipt.transaction.customerMobile || '';
    
    // Format phone number for Indian WhatsApp
    // Remove all non-digit characters
    mobile = mobile.replace(/\D/g, '');
    
    // If number starts with 0, remove it
    if (mobile.startsWith('0')) {
      mobile = mobile.substring(1);
    }
    
    // If number doesn't start with country code, add 91 (India)
    if (!mobile.startsWith('91') && mobile.length === 10) {
      mobile = '91' + mobile;
    }
    
    // Ensure it's a valid Indian number (should be 12 digits: 91 + 10 digits)
    if (mobile.length !== 12 || !mobile.startsWith('91')) {
      alert('Invalid phone number format. Please use Indian format: +91XXXXXXXXXX or 10-digit number');
      return;
    }
    
    // Format date properly
    const dateStr = receipt.transaction.createdAt;
    let formattedDate;
    try {
      // Parse the date - handle both ISO string and timestamp
      const date = new Date(parseInt(dateStr) || dateStr);
      formattedDate = date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      formattedDate = new Date().toLocaleString('en-IN');
    }
    
    const message = encodeURIComponent(
      `*${receipt.storeName}*\n` +
      `${receipt.storeAddress}\n\n` +
      `*Receipt: ${receipt.receiptNumber}*\n` +
      `Date: ${formattedDate}\n\n` +
      `*Items:*\n` +
      receipt.transaction.items.map(item => 
        `${item.product.name} x ${item.quantity} = ₹${item.subtotal.toFixed(2)}`
      ).join('\n') +
      `\n\n*Total: ₹${receipt.transaction.total.toFixed(2)}*\n\n` +
      `Thank you for your purchase!`
    );
    
    const whatsappUrl = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      ? `whatsapp://send?phone=${mobile}&text=${message}`
      : `https://web.whatsapp.com/send?phone=${mobile}&text=${message}`;
    
    window.open(whatsappUrl, '_blank');
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
                            ₹{product.price.toFixed(2)}
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
                        <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
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
                  Total: ₹{calculateTotal().toFixed(2)}
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
                  <option value="card">Card</option>
                  <option value="mobile">Mobile Payment</option>
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
                        <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell align="right">₹{item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Total: ₹{receipt.transaction.total.toFixed(2)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceipt(false)}>Close</Button>
          <Button 
            onClick={sendViaEmail} 
            startIcon={<EmailIcon />}
            disabled={!receipt?.transaction?.customerEmail || emailLoading}
          >
            {emailLoading ? 'Sending...' : 'Send via Email'}
          </Button>
          <Button 
            onClick={sendViaWhatsApp} 
            startIcon={<WhatsAppIcon />}
            color="success"
            disabled={!receipt?.transaction?.customerMobile}
          >
            Send via WhatsApp
          </Button>
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
            <TextField
              fullWidth
              label="Mobile Number"
              value={customerInfo.mobile}
              onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
              margin="normal"
              helperText="Required for WhatsApp receipt (with country code, e.g., +91XXXXXXXXXX)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
          <Button onClick={handleCustomerSubmit} variant="contained">Complete Sale</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
