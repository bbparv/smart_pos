import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';

const AuthContext = createContext(null);

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
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
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [getCurrentUser] = useLazyQuery(CURRENT_USER_QUERY, {
    onCompleted: (data) => {
      setUser(data.currentUser);
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    
    // Check if there's a saved redirect URL
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    
    // Define role-based access for each endpoint
    const roleAccess = {
      '/admin': ['admin'],
      '/manager': ['manager', 'admin'],
      '/cashier': ['cashier', 'manager', 'admin']
    };
    
    // If there's a saved redirect URL and user has access, redirect there
    if (redirectUrl && roleAccess[redirectUrl]?.includes(userData.role.name)) {
      navigate(redirectUrl);
      return;
    }
    
    // Otherwise, use default role-based redirection
    if (userData.role.name === 'admin') {
      navigate('/admin');
    } else if (userData.role.name === 'manager') {
      navigate('/manager');
    } else {
      navigate('/cashier');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role.name);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    return user.role.permissions.includes('*') || user.role.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
