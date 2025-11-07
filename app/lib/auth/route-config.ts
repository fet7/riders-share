import type { AllowedRoles } from "./route-protection.server";

export interface RouteConfig {
  path: string;
  allowedRoles: AllowedRoles;
  title?: string;
}

// Define permissions for all routes
export const routePermissions: Record<string, RouteConfig> = {
  '/dashboard': {
    path: '/dashboard',
    allowedRoles: 'all', // All authenticated users
    title: 'Dashboard'
  },
  '/shareholder': {
    path: '/shareholder',
    allowedRoles: ['admin', 'transfer_officer', 'shareholder_clerk'],
    title: 'Shareholder Management'
  },
  '/deposit': {
    path: '/deposit',
    allowedRoles: ['admin', 'deposit_clerk', 'shareholder_deposit_clerk'],
    title: 'Deposit Management'
  },
  '/analytics': {
    path: '/analytics',
    allowedRoles: ['admin', 'auditor', 'master_clerk'],
    title: 'Analytics & Reports'
  },
  '/profile': {
    path: '/profile',
    allowedRoles: 'all',
    title: 'Profile'
  },
  '/settings': {
    path: '/settings',
    allowedRoles: ['admin', 'master_clerk'],
    title: 'System Settings'
  },
  '/admin/create-user': {
    path: '/admin/create-user',
    allowedRoles: ['admin'],
    title: 'Create User'
  }
};

/**
 * Get route config for a specific path
 */
export function getRouteConfig(path: string): RouteConfig | undefined {
  return routePermissions[path];
}

/**
 * Get all routes that a user can access
 */
export function getAccessibleRoutes(userRole: string): RouteConfig[] {
  return Object.values(routePermissions).filter(route =>
    route.allowedRoles === 'all' || route.allowedRoles.includes(userRole)
  );
}
