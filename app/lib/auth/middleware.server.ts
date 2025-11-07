import { redirect } from "react-router";
import { AuthService } from "./auth.server";

/**
 * Middleware for protected routes - redirects to signin if not authenticated
 */
export async function requireAuthMiddleware(request: Request) {
  const auth = await AuthService.getAuthenticatedUser(request);

  if (!auth) {
    const url = new URL(request.url);
    throw redirect(`/signin?redirectTo=${encodeURIComponent(url.pathname)}`);
  }

  return auth;
}

/**
 * Middleware for role-based protection
 */
export async function requireRoleMiddleware(request: Request, requiredRole: string) {
  const auth = await requireAuthMiddleware(request);

  if (auth.user.role !== requiredRole) {
    throw new Response("Forbidden", { status: 403 });
  }

  return auth;
}

/**
 * Middleware that checks if user is authenticated (without redirect)
 * Useful for public routes that change behavior when user is logged in
 */
export async function optionalAuthMiddleware(request: Request) {
  return await AuthService.getAuthenticatedUser(request);
}
