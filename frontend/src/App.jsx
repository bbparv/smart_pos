import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { client } from './config/apolloClient';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { POSPanel } from './pages/POSPanel';
import { InventoryPanel } from './pages/InventoryPanel';
import { AdminPanel } from './pages/AdminPanel';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563EB', // Vibrant Blue 600 - Modern POS primary
      light: '#3B82F6', // Blue 500
      dark: '#1D4ED8', // Blue 700
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10B981', // Emerald 500 - Success/Action color
      light: '#34D399', // Emerald 400
      dark: '#059669', // Emerald 600
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Emerald 500
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B', // Amber 500
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444', // Red 500
      light: '#F87171',
      dark: '#DC2626',
    },
    info: {
      main: '#3B82F6', // Blue 500
      light: '#60A5FA',
      dark: '#2563EB',
    },
    background: {
      default: '#F8FAFC', // Slate 50
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // Slate 900
      secondary: '#64748B', // Slate 500
    },
    divider: '#E2E8F0', // Slate 200
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#0F172A',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#0F172A',
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.75rem',
      lineHeight: 1.3,
      color: '#0F172A',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: '#0F172A',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: '#1E293B',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: '#1E293B',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#64748B',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      color: '#64748B',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      color: '#475569',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9375rem',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0px 2px 4px rgba(15, 23, 42, 0.08)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0px 8px 16px rgba(15, 23, 42, 0.08)',
    '0px 12px 24px rgba(15, 23, 42, 0.08)',
    '0px 16px 32px rgba(15, 23, 42, 0.08)',
    '0px 20px 40px rgba(15, 23, 42, 0.08)',
    '0px 24px 48px rgba(15, 23, 42, 0.08)',
    '0px 2px 4px rgba(59, 130, 246, 0.1)',
    '0px 4px 8px rgba(59, 130, 246, 0.12)',
    '0px 8px 16px rgba(59, 130, 246, 0.14)',
    '0px 12px 24px rgba(59, 130, 246, 0.16)',
    '0px 16px 32px rgba(59, 130, 246, 0.18)',
    '0px 20px 40px rgba(59, 130, 246, 0.2)',
    '0px 24px 48px rgba(59, 130, 246, 0.22)',
    '0px 28px 56px rgba(59, 130, 246, 0.24)',
    '0px 32px 64px rgba(59, 130, 246, 0.26)',
    '0px 36px 72px rgba(59, 130, 246, 0.28)',
    '0px 40px 80px rgba(59, 130, 246, 0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: '0.9375rem',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(180deg, #1D4ED8 0%, #1E40AF 100%)',
            boxShadow: '0px 8px 16px rgba(37, 99, 235, 0.3)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(180deg, #2563EB 0%, #1D4ED8 100%)',
          '&:hover': {
            background: 'linear-gradient(180deg, #1D4ED8 0%, #1E40AF 100%)',
            boxShadow: '0px 8px 16px rgba(37, 99, 235, 0.3)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
          '&:hover': {
            background: 'linear-gradient(180deg, #059669 0%, #047857 100%)',
            boxShadow: '0px 8px 16px rgba(16, 185, 129, 0.3)',
          },
        },
        outlined: {
          borderColor: '#2563EB',
          color: '#2563EB',
          borderWidth: '2px',
          '&:hover': {
            borderColor: '#1D4ED8',
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
            borderWidth: '2px',
          },
        },
        text: {
          color: '#2563EB',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #F1F5F9',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #F1F5F9',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.8125rem',
        },
        filled: {
          border: '1px solid transparent',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FFFFFF',
            transition: 'all 0.2s',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3B82F6',
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: '#F8FAFC',
          color: '#64748B',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px',
        },
        body: {
          fontSize: '0.9375rem',
          color: '#334155',
          borderBottom: '1px solid #F1F5F9',
          padding: '16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0F172A',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #F1F5F9',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          color: '#64748B',
          '&.Mui-selected': {
            color: '#0F172A',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#0F172A',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#64748B',
          '&:hover': {
            backgroundColor: '#F8FAFC',
            color: '#0F172A',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
        },
        standardSuccess: {
          backgroundColor: '#F0FDF4',
          borderColor: '#BBF7D0',
          color: '#166534',
        },
        standardError: {
          backgroundColor: '#FEF2F2',
          borderColor: '#FECACA',
          color: '#991B1B',
        },
        standardWarning: {
          backgroundColor: '#FFFBEB',
          borderColor: '#FED7AA',
          color: '#92400E',
        },
        standardInfo: {
          backgroundColor: '#EFF6FF',
          borderColor: '#BFDBFE',
          color: '#1E40AF',
        },
      },
    },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/cashier"
                element={
                  <ProtectedRoute allowedRoles={['cashier', 'manager', 'admin']}>
                    <POSPanel />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/manager"
                element={
                  <ProtectedRoute allowedRoles={['manager', 'admin']}>
                    <InventoryPanel />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
