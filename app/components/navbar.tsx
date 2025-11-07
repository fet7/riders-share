import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "./ui/button";
import { NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

const routeLists = [
  { to: "/", label: "Home" },
  { to: "/sample", label: "Sample-form" },
  { to: "/shareholders", label: "Shareholder-form" },
  { to: "/sub-form", label: "Sub-form" },
  { to: "/deposits", label: "Deposit-form" },
  { to: "/report", label: "Report" },
  { to: "/hello", label: "Hello" },
];

export function Navbar() {
  return (
    <header className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold text-gray-800">
          RidersShare
        </NavLink>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {routeLists.map((item) => (
                <NavigationMenuItem key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-md text-lg transition-colors hover:bg-accent hover:text-accent-foreground ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4">
            <nav className="flex flex-col space-y-2 items-start">
              {routeLists.map((item) => (
                <SheetClose key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `w-60 text-left px-4 py-2 rounded-md text-lg hover:bg-accent hover:text-accent-foreground block ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
