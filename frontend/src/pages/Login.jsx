import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Store as StoreIcon } from '@mui/icons-material';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role {
          id
          name
          permissions
        }
      }
    }
  }
`;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.token, data.login.user);
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    loginMutation({
      variables: {
        input: { email, password }
      }
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F8FAFC'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Smart POS
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inventory & Replenishment System
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Box mt={3} p={2} bgcolor="grey.100" borderRadius={2}>
            <Typography variant="caption" display="block" gutterBottom fontWeight="bold">
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block">
              Admin: admin@pos.com / admin123
            </Typography>
            <Typography variant="caption" display="block">
              Manager: manager@pos.com / manager123
            </Typography>
            <Typography variant="caption" display="block">
              Cashier: cashier@pos.com / cashier123
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
