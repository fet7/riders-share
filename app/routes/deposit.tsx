import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { DataTable } from "~/components/data/data-table";
import { DepositForm } from "~/components/entities/deposit/deposit-form";
import { getDepositColumns } from "~/components/entities/deposit/columns";
import { getAllDeposits } from "~/lib/api/deposits.server";
import { validateAndHandleAction } from "~/lib/validation/handler";
import { DepositSchema } from "~/lib/validation/deposit";
import { createDeposit, updateDeposit, deleteDeposit } from "~/lib/api/deposits.server";
import type { Deposit } from "~/lib/validation/deposit";
import { useState } from "react";
import { Banknote } from "lucide-react";
import { DeleteDialog } from "~/components/data/delete-dialog";
import { toast } from "sonner";
import { protectRoute } from "~/lib/auth/route-protection.server";

export async function loader(args: LoaderFunctionArgs) {
  const user = await protectRoute(args.request);
  const deposits = await getAllDeposits();
  return { user, deposits };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const formDataObj = Object.fromEntries(formData);
  const actionType = String(formData.get("_action") ?? "");
  const id = formData.get("id")?.toString();

  return await validateAndHandleAction({
    actionType,
    id,
    data: formDataObj,
    schema: DepositSchema,
    createFn: createDeposit,
    updateFn: updateDeposit,
    deleteFn: deleteDeposit,
  });
}

export default function DepositPage() {
  const { deposits } = useLoaderData<typeof loader>();
  const [editing, setEditing] = useState<Deposit | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [depositToDelete, setDepositToDelete] = useState<Deposit | null>(null);

  const deleteFetcher = useFetcher();
  const formFetcher = useFetcher();
  const isDeleting = deleteFetcher.state === "submitting";

  const handleEdit = (deposit: Deposit) => {
    console.log("Edit button clicked for: ", deposit);
    setEditing(deposit);
    setFormOpen(true);
  };

  const handleDeleteClick = (deposit: Deposit) => {
    setDepositToDelete(deposit);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!depositToDelete) return;

    try {
      deleteFetcher.submit(
        {
          _action: "delete",
          id: depositToDelete.deposit_id,
        },
        { method: "post" }
      );

      if (!deleteFetcher.data?.error) {
        toast.success("Deposit deleted successfully", {
          description: `${depositToDelete.deposit_id} has been deleted.`,
        });
      } else {
        toast.error("Failed to delete deposit", {
          description: deleteFetcher.data.error,
        });
      }
    } catch (error) {
      toast.error("Failed to delete deposit", {
        description: "An unexpected error occurred.",
      });
    }
    setDeleteDialogOpen(false);
    setDepositToDelete(null);
  };

  const handleFormSubmit = () => {
    if (formFetcher.state === "idle" && formFetcher.data) {
      if (formFetcher.data.success) {
        const isEdit = !!editing;
        const action = isEdit ? "updated" : "created";

        toast.success(`Deposit ${action} successfully`, {
          description: `${editing?.deposit_id || "New deposit"} has been ${action}.`,
        });

        // Close form and reset
        setFormOpen(false);
        setEditing(null);
      } else {
        toast.error("Failed to save deposit", {
          description: formFetcher.data.error || "Please check the form for errors.",
        });
      }
    }
  };

  // Check form submission status when fetcher changes
  if (formFetcher.state === "idle" && formFetcher.data) {
    handleFormSubmit();
  }

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditing(null);
  };

  return (
    <div className="space-y-12 p-6">
      <div className="flex items-center gap-3">
        <Banknote className="h-6 w-6 lg:h-8 lg:w-8" />
        <h1 className="text-2xl lg:text-3xl font-bold">Deposits</h1>
      </div>

      <div>
        <DataTable
          data={deposits}
          columns={getDepositColumns()}
          addButtonText="Add New"
          onAddClick={() => setFormOpen(true)}
          searchPlaceholder="Search deposits..."
          enableRowActions
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <DepositForm
          editDeposit={editing}
          open={formOpen}
          onOpenChange={handleFormOpenChange}
          fetcher={formFetcher}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          title="Delete Deposit"
          description={`Are you sure you want to delete deposit ${depositToDelete?.deposit_id}? This action cannot be undone.`}
          confirmText="Delete"
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
