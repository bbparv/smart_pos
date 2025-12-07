import { GraphQLError } from 'graphql';

export const requireAuth = (user) => {
  if (!user) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' }
    });
  }
};

export const requireRole = (user, allowedRoles) => {
  requireAuth(user);
  
  if (!allowedRoles.includes(user.role.name)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
};

export const hasPermission = (user, permission) => {
  requireAuth(user);
  
  if (!user.role.permissions.includes(permission)) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
};

// Role hierarchy: admin > manager > cashier
export const requireMinRole = (user, minRole) => {
  requireAuth(user);
  
  const roleHierarchy = {
    'cashier': 1,
    'manager': 2,
    'admin': 3
  };
  
  const userLevel = roleHierarchy[user.role.name] || 0;
  const requiredLevel = roleHierarchy[minRole] || 0;
  
  if (userLevel < requiredLevel) {
    throw new GraphQLError('Insufficient permissions', {
      extensions: { code: 'FORBIDDEN' }
    });
  }
};
