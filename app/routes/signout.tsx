import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { signout, getAuthenticatedUser } from "~/lib/auth/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log("Logout action triggered!");

  // Get the current user for audit logging (optional)
  const user = await getAuthenticatedUser(request);

  // Get IP address for audit log
  const ipAddress = request.headers.get("CF-Connecting-IP") ||
                   request.headers.get("X-Forwarded-For") ||
                   "unknown";

  const cookie = await signout(request);

  // Use redirect helper instead of new Response
  return redirect("/signin", {
    headers: {
      "Set-Cookie": cookie
    }
  });
}

export default function Logout() {
  return null;
}
