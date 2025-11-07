import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Riders Share Management System" },
    {
      name: "description",
      content: "Welcome to Riders Share Management System",
    },
  ];
}

export default function Home() {
  // this part is button
  return (
    <div className="px-8">
      <Button>
        <Link to="/sample">Sample</Link>
      </Button>
    </div>
  );
}
