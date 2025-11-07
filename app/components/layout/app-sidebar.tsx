import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "~/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Building,
  FileText,
  BarChart3,
  Users,
  CreditCard,
  HelpCircle,
  Menu,
  ChartPie,
  Banknote,
  Home,
} from "lucide-react";
import { Form, Link, useFetcher, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "../theme-toggle";
import { useCallback } from "react";

export const menuItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Shareholder",
    href: "/shareholder",
    icon: ChartPie
  },
  {
    title: "Deposit",
    href: "/deposit",
    icon: Banknote
  },
];

export const secondaryItems = [
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Help & Support",
    href: "/help",
    icon: HelpCircle,
  },
];

export const workspaceItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Shareholders",
    href: "/shareholders",
    icon: ChartPie
  },
  {
    title: "Statements",
    href: "/statements",
    icon: Banknote
  },
   {
    title: "Deposits",
    href: "/deposits",
    icon: LayoutDashboard,
  },
];

export function MobileSidebarTrigger() {
  return (
    <SidebarTrigger className="lg:hidden">
      <Menu className="h-5 w-5" />
    </SidebarTrigger>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }

    if (location.pathname === href) {
      return true;
    }

    if (location.pathname.startsWith(href + "/")) {
      return true;
    }

    return false;
  };

  const handleMenuClick = useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return (
    <Sidebar
      className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Riders Manufacturing</h1>
            <p className="text-xs text-muted-foreground">Workspace</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-auto">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Workspace */}
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link
                    to={item.href}
                    onClick={handleMenuClick}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Feysel Abrar</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </div>
        </div>

        {/* Logout button and theme toggle */}
        <div className="flex flex-col items-start justify-between gap-2">
          <Form method="post" action="/signout" className="flex-1" >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
              size="sm"
              onClick={handleMenuClick}
            >
              <LogOut className="h-4 w-4" />
              <span className="lg:inline hidden">Sign out</span>
            </Button>
          </Form>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
