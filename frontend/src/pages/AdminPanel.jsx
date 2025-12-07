import { useState } from 'react';
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
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const USERS_QUERY = gql`
  query Users {
    users {
      id
      email
      name
      role {
        id
        name
      }
      createdAt
    }
  }
`;

const ROLES_QUERY = gql`
  query Roles {
    roles {
      id
      name
      permissions
    }
  }
`;

const AUDIT_LOGS_QUERY = gql`
  query AuditLogs($limit: Int) {
    auditLogs(limit: $limit) {
      id
      user {
        name
        email
      }
      action
      entity
      entityId
      timestamp
    }
  }
`;

const SYSTEM_CONFIGS_QUERY = gql`
  query SystemConfigs {
    systemConfigs {
      id
      key
      value
      updatedBy {
        name
      }
      updatedAt
    }
  }
`;

const SALES_ANALYTICS_QUERY = gql`
  query SalesAnalytics {
    salesAnalytics {
      totalSales
      totalTransactions
      averageTransaction
      topProducts {
        product {
          name
        }
        totalQuantity
        totalRevenue
      }
      salesByDay {
        date
        total
        transactions
      }
    }
  }
`;

const INVENTORY_ANALYTICS_QUERY = gql`
  query InventoryAnalytics {
    inventoryAnalytics {
      totalProducts
      lowStockProducts
      totalValue
      turnoverRate
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: RegisterInput!) {
    createUser(input: $input) {
      id
      name
    }
  }
`;

const UPDATE_USER_ROLE_MUTATION = gql`
  mutation UpdateUserRole($userId: Int!, $roleId: Int!) {
    updateUserRole(userId: $userId, roleId: $roleId) {
      id
      role {
        name
      }
    }
  }
`;

const SET_SYSTEM_CONFIG_MUTATION = gql`
  mutation SetSystemConfig($input: SystemConfigInput!) {
    setSystemConfig(input: $input) {
      id
      key
      value
    }
  }
`;

export const AdminPanel = () => {
  const { user, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [userDialog, setUserDialog] = useState(false);
  const [configDialog, setConfigDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { data: usersData, refetch: refetchUsers } = useQuery(USERS_QUERY);
  const { data: rolesData } = useQuery(ROLES_QUERY);
  const { data: auditLogsData } = useQuery(AUDIT_LOGS_QUERY, {
    variables: { limit: 100 }
  });
  const { data: configsData, refetch: refetchConfigs } = useQuery(SYSTEM_CONFIGS_QUERY);
  const { data: salesData } = useQuery(SALES_ANALYTICS_QUERY);
  const { data: inventoryData } = useQuery(INVENTORY_ANALYTICS_QUERY);

  const [createUser] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      refetchUsers();
      setUserDialog(false);
      showSuccess('User created successfully');
    }
  });

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE_MUTATION, {
    onCompleted: () => {
      refetchUsers();
      showSuccess('User role updated');
    }
  });

  const [setSystemConfig] = useMutation(SET_SYSTEM_CONFIG_MUTATION, {
    onCompleted: () => {
      refetchConfigs();
      setConfigDialog(false);
      showSuccess('Configuration updated');
    }
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUserSubmit = (formData) => {
    createUser({
      variables: {
        input: {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          roleId: parseInt(formData.roleId)
        }
      }
    });
  };

  const handleConfigSubmit = (formData) => {
    setSystemConfig({
      variables: {
        input: {
          key: formData.key,
          value: formData.value
        }
      }
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <AdminIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel - {user?.name}
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
            <Tab label="Analytics" />
            <Tab label="Users" />
            <Tab label="System Config" />
            <Tab label="Audit Logs" />
          </Tabs>

          {/* Analytics Tab */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Analytics Dashboard
              </Typography>

              {/* Metric Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Total Sales
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            ₹{salesData?.salesAnalytics.totalSales.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <MoneyIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Transactions
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {salesData?.salesAnalytics.totalTransactions || 0}
                          </Typography>
                        </Box>
                        <ShoppingCartIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Avg Transaction
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            ₹{salesData?.salesAnalytics.averageTransaction.toFixed(2) || '0.00'}
                          </Typography>
                        </Box>
                        <TrendingUpIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ 
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white'
                  }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                            Total Products
                          </Typography>
                          <Typography variant="h4" fontWeight="bold">
                            {inventoryData?.inventoryAnalytics.totalProducts || 0}
                          </Typography>
                        </Box>
                        <InventoryIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Charts Grid */}
              <Grid container spacing={3}>
                {/* Sales Trend Line Chart */}
                <Grid item xs={12} lg={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Sales Trend (Last 7 Days)
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={salesData?.salesAnalytics.salesByDay.slice(-7).map(s => ({
                            date: new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                            sales: s.total,
                            transactions: s.transactions
                          })) || []}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#667eea" 
                            strokeWidth={3}
                            dot={{ fill: '#667eea', r: 5 }}
                            activeDot={{ r: 7 }}
                            name="Sales (₹)"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="transactions" 
                            stroke="#f093fb" 
                            strokeWidth={2}
                            dot={{ fill: '#f093fb', r: 4 }}
                            name="Transactions"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Inventory Status Pie Chart */}
                <Grid item xs={12} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Inventory Status
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              { 
                                name: 'In Stock', 
                                value: (inventoryData?.inventoryAnalytics.totalProducts || 0) - (inventoryData?.inventoryAnalytics.lowStockProducts || 0),
                                color: '#10B981'
                              },
                              { 
                                name: 'Low Stock', 
                                value: inventoryData?.inventoryAnalytics.lowStockProducts || 0,
                                color: '#EF4444'
                              }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {[{ color: '#10B981' }, { color: '#EF4444' }].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Revenue Area Chart */}
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Revenue Overview
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart
                          data={salesData?.salesAnalytics.salesByDay.slice(-7).map(s => ({
                            date: new Date(s.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                            revenue: s.total
                          })) || []}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#667eea" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorRevenue)"
                            name="Revenue (₹)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Top Products Bar Chart */}
                <Grid item xs={12} lg={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Top 5 Products by Revenue
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={salesData?.salesAnalytics.topProducts.slice(0, 5).map(p => ({
                            name: p.product.name.length > 15 ? p.product.name.substring(0, 15) + '...' : p.product.name,
                            revenue: p.totalRevenue,
                            quantity: p.totalQuantity
                          })) || []}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis type="number" stroke="#64748B" />
                          <YAxis dataKey="name" type="category" stroke="#64748B" width={120} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#fff', 
                              border: '1px solid #e2e8f0',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="revenue" fill="#667eea" name="Revenue (₹)" radius={[0, 8, 8, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Users Tab */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">User Management</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setUserDialog(true)}
                >
                  Add User
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersData?.users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Chip label={u.role.name} size="small" />
                        </TableCell>
                        <TableCell>{new Date(parseInt(u.createdAt)).toLocaleDateString()}</TableCell>
                        <TableCell align="center">
                          <TextField
                            select
                            size="small"
                            value={u.role.id}
                            onChange={(e) => updateUserRole({
                              variables: {
                                userId: u.id,
                                roleId: parseInt(e.target.value)
                              }
                            })}
                            SelectProps={{ native: true }}
                          >
                            {rolesData?.roles.map(role => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </TextField>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* System Config Tab */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">System Configuration</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setConfigDialog(true)}
                >
                  Add Config
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Key</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell>Updated By</TableCell>
                      <TableCell>Updated At</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {configsData?.systemConfigs.map(config => (
                      <TableRow key={config.id}>
                        <TableCell><strong>{config.key}</strong></TableCell>
                        <TableCell>{config.value}</TableCell>
                        <TableCell>{config.updatedBy.name}</TableCell>
                        <TableCell>{new Date(parseInt(config.updatedAt)).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Audit Logs Tab */}
          {tabValue === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Audit Logs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Entity</TableCell>
                      <TableCell>Entity ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogsData?.auditLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp ? new Date(parseInt(log.timestamp)).toLocaleString() : 'N/A'}</TableCell>
                        <TableCell>{log.user.name}</TableCell>
                        <TableCell>
                          <Chip label={log.action} size="small" color="primary" />
                        </TableCell>
                        <TableCell>{log.entity}</TableCell>
                        <TableCell>{log.entityId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
      </Container>

      {/* User Dialog */}
      <UserDialog
        open={userDialog}
        onClose={() => setUserDialog(false)}
        onSubmit={handleUserSubmit}
        roles={rolesData?.roles || []}
      />

      {/* Config Dialog */}
      <ConfigDialog
        open={configDialog}
        onClose={() => setConfigDialog(false)}
        onSubmit={handleConfigSubmit}
      />
    </Box>
  );
};

// User Dialog Component
const UserDialog = ({ open, onClose, onSubmit, roles }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roleId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ email: '', password: '', name: '', roleId: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Role"
            value={formData.roleId}
            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
            SelectProps={{ native: true }}
            margin="normal"
            required
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Create</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

// Config Dialog Component
const ConfigDialog = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    key: '',
    value: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ key: '', value: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Set System Configuration</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Config Key"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            margin="normal"
            required
            placeholder="e.g., store_name, store_address"
          />
          <TextField
            fullWidth
            label="Config Value"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            margin="normal"
            required
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
