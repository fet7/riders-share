
import type { Route } from "./+types/home";
import { Link } from "react-router";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const showToast = () => {
    toast.info("This is a public toast from the home page!", {
      description: "Theme system is now working properly!",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-20">
      <div className="text-center space-y-6 max-w-md w-full">
        <h1 className="text-3xl lg:text-4xl font-bold">Welcome to Your App</h1>
        <p className="text-muted-foreground text-sm lg:text-base">
          This is the public home page. The app section contains protected routes
          with sidebar navigation. The theme system now works exactly like Next.js.org.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 flex-1 sm:flex-none"
          >
            Go to App
          </Link>
          <button
            onClick={showToast}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1 sm:flex-none"
          >
            Test Toast
          </button>
        </div>
      </div>
    </div>
  );
}
