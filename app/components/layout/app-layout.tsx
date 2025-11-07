import { Outlet } from "react-router";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";
import { Navbar } from "./navbar";

interface AppLayoutProps {
  children?: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (


    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <div className="flex flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <Navbar/>
            <div className="container mx-auto p-4 lg:p-6">
              {/* Desktop page title - hidden on mobile since we show it in header */}
              <div className="hidden lg:block mb-6">
              </div>
              {/* Render either children (if provided) or Outlet for nested routes */}
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
