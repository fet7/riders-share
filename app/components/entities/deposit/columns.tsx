import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import type { Deposit } from "~/lib/validation/deposit";

export function getDepositColumns(): ColumnDef<Deposit>[] {
  return [
    {
      accessorKey: "deposit_id",
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
      accessorKey: "deposit_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return (
          <span className="text-sm">
            {new Date(date).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      accessorKey: "shareholder_name",
      header: "Shareholder",
      cell: ({ getValue }) => (
        <span className="font-medium">{getValue() as string || "-"}</span>
      ),
    },
    {
      accessorKey: "depositor_name",
      header: "Depositor",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
    {
      accessorKey: "deposit_amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent font-semibold"
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const amount = getValue() as number;
        return (
          <span className="font-medium text-green-600">
            {amount?.toLocaleString('en-ET', {
              style: 'currency',
              currency: 'ETB',
              minimumFractionDigits: 2
            })}
          </span>
        );
      },
    },
    {
      accessorKey: "bank_name",
      header: "Bank",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
    {
      accessorKey: "account_type",
      header: "Account Type",
      cell: ({ getValue }) => (
        <span className="text-xs bg-muted px-2 py-1 rounded-full">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "ref_num",
      header: "Reference",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {getValue() as string || "-"}
        </span>
      ),
    },
  ];
}
