import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useSearchParams } from "react-router";
import { publicLoader } from "~/lib/auth/route-utils.server";
import { signin } from "~/lib/auth/auth.server";

export async function loader(args: LoaderFunctionArgs) {
  return publicLoader(args);
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/app");

  // Get IP address and user agent
  const ipAddress = request.headers.get("CF-Connecting-IP") ||
                   request.headers.get("X-Forwarded-For") ||
                   "unknown";
  const userAgent = request.headers.get("User-Agent") ?? undefined;

  const result = await signin(email, password, ipAddress, userAgent);

  if (result.success && result.cookie) {
    // Redirect with session cookie
    return new Response(null, {
      status: 302,
      headers: {
        "Location": redirectTo,
        "Set-Cookie": result.cookie
      }
    });
  }

  return { error: result.error };
}

export default function Signin() {
  const actionData = useActionData<{ error?: string }>();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">Sign in to your account</h2>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          {actionData?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Email address"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>

          <div className="text-center">
            <a href="/register" className="text-sm text-primary hover:underline">
              Don't have an account? Sign up
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
}
