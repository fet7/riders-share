import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useActionData, useNavigation, Link, redirect } from "react-router";
import { publicLoader } from "~/lib/auth/route-utils.server";
import { publicRegister, hasExistingUsers, getAuthenticatedUser } from "~/lib/auth/auth.server";

export async function loader(args: LoaderFunctionArgs) {
  const { request } = args;

  const user = await getAuthenticatedUser(request);
  if (user) {
    return redirect("/");
  }

  const usersExist = await hasExistingUsers();
  if (usersExist) {
    return redirect("/signup?message=not_found");
  }

  return publicLoader(args);
}

export async function action({ request }: ActionFunctionArgs) {
  const usersExist = await hasExistingUsers();
  if (usersExist) {
    return { error: "Public registration is no longer available. Please contact an administrator." };
  }

  const formData = await request.formData();

  const userData = {
    full_name: String(formData.get("full_name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  // Get IP address and user agent
  const ipAddress = request.headers.get("CF-Connecting-IP") ||
                   request.headers.get("X-Forwarded-For") ||
                   "unknown";
  const userAgent = request.headers.get("User-Agent") ?? undefined;

  const result = await publicRegister(userData, ipAddress, userAgent);

  if (result.success) {
    // Redirect to signin with success message
    return redirect("/signin?message=first_user_created");
  }

  return { error: result.error };
}

// The component remains exactly the same as before
export default function Register() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold">Create Administrator Account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Create the first administrator account for the system
          </p>
        </div>

        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
              {actionData.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating administrator account..." : "Create Administrator Account"}
            </button>
          </div>
        </Form>
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            This will create the first system administrator account. After registration, you will be able to log in and create additional user accounts.
          </p>
        </div>
      </div>
    </div>
  );
}
