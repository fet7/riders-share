import { Link, useLocation } from "react-router";
import { MobileSidebarTrigger } from "./app-sidebar";
import { SidebarTrigger } from "../ui/sidebar";

// Navigation items for the navbar
const navItems = [
  { name: "Home", href: "/" },
  { name: "Signin", href: "/signin" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b bg-blue-300 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Left side - Mobile sidebar trigger */}
          <div className="flex items-center">
           {/*  <MobileSidebarTrigger /> */}
            <SidebarTrigger/>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
          </div>
        </div>
      </div>
     </header>
  );
}
