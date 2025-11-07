import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useFetcher } from "react-router";
import { DataTable } from "~/components/data/data-table";
import { ShareholderForm } from "~/components/entities/shareholder/shareholder-form";
import { getShareholderColumns } from "~/components/entities/shareholder/columns";
import { getAllShareholders } from "~/lib/api/shareholders.server";
import { validateAndHandleAction } from "~/lib/validation/handler";
import { ShareholderSchema } from "~/lib/validation/shareholder";
import { createShareholder, updateShareholder, deleteShareholder } from "~/lib/api/shareholders.server";
import type { Shareholder } from "~/lib/validation/shareholder";
import { useState } from "react";
import { ChartPie  } from "lucide-react";
import { DeleteDialog } from "~/components/data/delete-dialog";
import { toast } from "sonner";
import { protectPage } from "~/lib/auth/protected-route.server";

export async function loader( args: LoaderFunctionArgs) {
  const user = await protectPage(args.request);
  const shareholders = await getAllShareholders();
  return { user, shareholders };
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
    schema: ShareholderSchema,
    createFn: createShareholder,
    updateFn: updateShareholder,
    deleteFn: deleteShareholder,
  });
}

export default function ShareholderPage() {
  const { shareholders } = useLoaderData<typeof loader>();
  const [editing, setEditing] = useState<Shareholder | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareholderToDelete, setShareholderToDelete] = useState<Shareholder | null>(null);

  const deleteFetcher = useFetcher();
  const formFetcher = useFetcher();
  const isDeleting = deleteFetcher.state === "submitting";


  const handleEdit = (shareholder: Shareholder) => {
    setEditing(shareholder);
    setFormOpen(true);
  };

  const handleDeleteClick = (shareholder: Shareholder) => {
    setShareholderToDelete(shareholder);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
        if (!shareholderToDelete) return;


        try {
            deleteFetcher.submit(
            {
                _action: "delete",
                id: shareholderToDelete.shareholder_id,
            },
            { method: "post"
             },
            );

             if (!deleteFetcher.data?.error) {
                toast.success("Shareholder deleted successfully", {
                description: `${shareholderToDelete.name_english} has been deleted.`,
                });
             } else {
                toast.error("Failed to delete shareholder", {
                description: deleteFetcher.data.error,
                });
             }
            } catch (error){
                toast.error("Failed to delete shareholder", {
                    description: "An unexpected error occurred.",
                });
            }
            setDeleteDialogOpen(false);
            setShareholderToDelete(null);
  };

  const handleFormSubmit = () => {
    if (formFetcher.state === "idle" && formFetcher.data) {
      if (formFetcher.data.success) {
        const isEdit = !!editing;
        const action = isEdit ? "updated" : "created";
        const name = editing?.name_english || "New shareholder";

        toast.success(`Shareholder ${action} successfully`, {
          description: `${name} has been ${action}.`,
        });

        // Close form and reset
        setFormOpen(false);
        setEditing(null);
      } else {
        toast.error("Failed to save shareholder", {
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
        <ChartPie className="h-6 w-6 lg:h-8 lg:w-8" />
        <h1 className="text-2xl lg:text-3xl font-bold">Shareholders</h1>
      </div>
    <div>
      <DataTable
        data={shareholders}
        columns={getShareholderColumns()}
        addButtonText="Add New"
        onAddClick={() => setFormOpen(true)}
        searchPlaceholder="Search shareholders..."
        enableRowActions
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <ShareholderForm
        editShareholder={editing}
        open={formOpen}
        onOpenChange={handleFormOpenChange}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Shareholder"
        description={`Are you sure you want to delete ${shareholderToDelete?.name_english}? This action cannot be undone.`}
        confirmText="Delete"
        isDeleting={isDeleting}
      />
    </div>
    </div>
  );
}
