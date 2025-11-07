import type { Route } from "../+types/root";
import { FileText } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Documents" }];
}

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Documents</h1>
      </div>
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Access and manage your documents.
        </p>
      </div>
    </div>
  );
}
