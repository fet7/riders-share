import type { Route } from "../+types/root";
import { toast } from "sonner";
import { LayoutDashboard } from "lucide-react";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { protectRoute } from "~/lib/auth/route-protection.server";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export async function loader(args: LoaderFunctionArgs) {
    const user = await protectRoute(args.request);
    return { user }
}
export default function Dashboard() {
  const showToast = () => {
    toast.success("This is a success toast from the dashboard!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-6 w-6 lg:h-8 lg:w-8" />
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4 lg:p-6">
          <h3 className="font-semibold text-sm lg:text-base">Welcome</h3>
          <p className="text-xs lg:text-sm text-muted-foreground mt-2">
            Welcome to your dashboard. This area is protected and will eventually
            be under RBAC control.
          </p>
        </div>
        <div className="rounded-lg border p-4 lg:p-6">
          <h3 className="font-semibold text-sm lg:text-base">Quick Actions</h3>
          <button
            onClick={showToast}
            className="mt-3 bg-primary text-primary-foreground px-3 py-2 rounded-md text-xs lg:text-sm w-full sm:w-auto"
          >
            Test Toast
          </button>
        </div>
        <div className="rounded-lg border p-4 lg:p-6 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-sm lg:text-base">Recent Activity</h3>
          <p className="text-xs lg:text-sm text-muted-foreground mt-2">
            Your recent activity will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
