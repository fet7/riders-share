import { Trash2 } from "lucide-react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";

export function DeleteForm({ id }: { id: number }) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  return (
    <fetcher.Form
      method="post"
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Are you sure you want to delete this data? This action cannot be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="_action" value="delete" />
      <input type="hidden" name="id" value={id} />
      <Button
        variant="destructive"
        size="icon"
        type="submit"
        disabled={isSubmitting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </fetcher.Form>
  );
}