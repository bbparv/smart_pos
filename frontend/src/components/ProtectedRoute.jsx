import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Save the requested URL to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.name)) {
    // Redirect to appropriate panel based on role
    if (user.role.name === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (user.role.name === 'manager') {
      return <Navigate to="/manager" replace />;
    } else {
      return <Navigate to="/cashier" replace />;
    }
  }

  return children;
};
