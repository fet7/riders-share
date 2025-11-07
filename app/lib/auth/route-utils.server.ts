import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { optionalAuthMiddleware, requireAuthMiddleware, requireRoleMiddleware } from "./middleware.server";

/**
 * Protected loader - automatically redirects to signin if not authenticated
 */
export async function protectedLoader({ request }: LoaderFunctionArgs) {
  const auth = await requireAuthMiddleware(request);
  return { user: auth.user };
}

/**
 * Role-protected loader
 */
export async function roleProtectedLoader(requiredRole: string) {
  return async ({ request }: LoaderFunctionArgs) => {
    const auth = await requireRoleMiddleware(request, requiredRole);
    return { user: auth.user };
  };
}

/**
 * Admin-only loader
 */
export async function adminLoader({ request }: LoaderFunctionArgs) {
  const auth = await requireRoleMiddleware(request, 'system_administrator');
  return { user: auth.user };
}

/**
 * Public loader with optional auth
 */
export async function publicLoader({ request }: LoaderFunctionArgs) {
  const auth = await optionalAuthMiddleware(request);
  return { user: auth?.user || null };
}

/**
 * Protected action - returns 401 if not authenticated
 */
export async function protectedAction({ request }: ActionFunctionArgs) {
  const auth = await requireAuthMiddleware(request);
  return { user: auth.user };
}
