import { redirect } from "react-router";
import { getAuthenticatedUser } from "./auth.server";

export type AllowedRoles = 'all' | string[];

/**
 * Protect a route - requires authentication but any role can access
 */
export async function protectRoute(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams({
      redirectTo: url.pathname + url.search
    });

    throw redirect(`/signin?${searchParams}`);
  }

  return user;
}

/**
 * Protect a route with specific role requirements
 */
export async function protectRouteWithRoles(
  request: Request,
  allowedRoles: AllowedRoles
) {
  const user = await protectRoute(request);

  if (allowedRoles !== 'all' && !allowedRoles.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}

/**
 * Check if user has access to a route (for UI/navigation)
 */
export function userHasAccess(user: any, allowedRoles: AllowedRoles): boolean {
  if (!user) return false;
  if (allowedRoles === 'all') return true;
  return allowedRoles.includes(user.role);
}
