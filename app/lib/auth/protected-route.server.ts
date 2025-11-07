import { redirect } from "react-router";
import { getRouteConfig } from "./route-config";
import { getAuthenticatedUser } from "./auth.server";

/**
 * Universal route protection - use this in every protected route's loader
 */
export async function protectPage(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Get the current route configuration
  const routeConfig = getRouteConfig(path);

  // If no route config exists, allow access (or you can deny - your choice)
  if (!routeConfig) {
    // Option 1: Allow access to routes not in config
    const user = await getAuthenticatedUser(request);
    if (!user) {
      throw redirect(`/signin?redirectTo=${encodeURIComponent(path)}`);
    }
    return user;

    // Option 2: Deny access to routes not in config
    // throw new Response("Not Found", { status: 404 });
  }

  // Check authentication
  const user = await getAuthenticatedUser(request);
  if (!user) {
    throw redirect(`/signin?redirectTo=${encodeURIComponent(path)}`);
  }

  // Check authorization
  if (routeConfig.allowedRoles !== 'all' && !routeConfig.allowedRoles.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }

  return user;
}
