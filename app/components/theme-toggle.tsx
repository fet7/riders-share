import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center justify-evenly rounded-full border p-1 space-x-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-black/5 dark:shadow-white/5 relative overflow-hidden md:max-w-30">
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-background/80 to-muted/20 pointer-events-none" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={`rounded-full h-8 w-8 transition-all relative overflow-hidden ${
          theme === "light"
            ? "bg-gradient-to-b from-accent to-accent/90 text-accent-foreground shadow-lg shadow-accent/25 dark:shadow-accent/40 transform scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        title="Light mode"
      >
        {/* Active state inner glow */}
        {theme === "light" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
        <Sun className="h-3.5 w-3.5 relative z-10" />
        <span className="sr-only">Light mode</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("system")}
        className={`rounded-full h-8 w-8 transition-all relative overflow-hidden ${
          theme === "system"
            ? "bg-gradient-to-b from-accent to-accent/90 text-accent-foreground  dark:shadow-accent/10 transform scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        title="System preference"
      >
        {/* Active state inner glow */}
        {theme === "system" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
        <Monitor className="h-3.5 w-3.5 relative z-10" />
        <span className="sr-only">System preference</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={`rounded-full h-8 w-8 transition-all relative overflow-hidden ${
          theme === "dark"
            ? "bg-gradient-to-b from-accent to-accent/90 text-accent-foreground transform scale-105"
            : "text-muted-foreground hover:text-foreground hover:scale-105"
        }`}
        title="Dark mode"
      >
        {/* Active state inner glow */}
        {theme === "dark" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        )}
        <Moon className="h-3.5 w-3.5 relative z-10" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  );
}
