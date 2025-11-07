import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Shareholder } from "~/lib/validation/shareholder";

export function getShareholderColumns(): ColumnDef<Shareholder>[] {

  return [
    {
      accessorKey: "shareholder_id",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium text-foreground">
          {getValue() as string}
        </span>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "name_english",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Name (English)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "name_amharic",
      header: "Name (Amharic)",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
    {
      accessorKey: "phone_primary",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
    {
      accessorKey: "national_id_num",
      header: "National ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
  ];
}
