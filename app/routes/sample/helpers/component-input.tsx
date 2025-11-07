import { Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import type { Sample } from "./validation";

export function InputId({ id }: { id: number }) {
  return <input type="hidden" name="id" value={id} />;
}

export function InputAction({ isEdit }: { isEdit: boolean }) {
  return (
    <input type="hidden" name="_action" value={isEdit ? "update" : "create"} />
  );
}

export function InputName({
  fetcherData,
  editSample,
}: {
  fetcherData: any;
  editSample: Sample | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <Input
        id="name"
        name="name"
        defaultValue={fetcherData?.fields?.name ?? editSample?.name ?? ""}
        aria-invalid={Boolean(fetcherData?.errors?.name)}
        aria-describedby="name-error"
        placeholder="e.g. Sample A"
      />
      {fetcherData?.errors?.name && (
        <p id="name-error" className="text-sm text-red-500">
          {fetcherData.errors.name[0]}
        </p>
      )}
    </div>
  );
}

export function InputDescription({
  fetcherData,
  editSample,
}: {
  fetcherData: any;
  editSample: Sample | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        name="description"
        defaultValue={
          fetcherData?.fields?.description ?? editSample?.description ?? ""
        }
        aria-invalid={Boolean(fetcherData?.errors?.description)}
        aria-describedby="description-error"
        placeholder="Provide a brief description..."
        rows={4}
      />
      {fetcherData?.errors?.description && (
        <p id="description-error" className="text-sm text-red-500">
          {fetcherData.errors.description[0]}
        </p>
      )}
    </div>
  );
}

export function InputImage() {
  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image</Label>
      <Input type="file" id="image" name="image" accept="image/*" />
    </div>
  );
}

export function InputSubmit({
  isEdit,
  isSubmitting,
}: {
  isEdit: boolean;
  isSubmitting: boolean;
}) {
  const submitButtonText = isEdit ? "Update" : "Create";
  return (
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Processing..." : submitButtonText}
    </Button>
  );
}

export function EditButton({
  sample,
  handleEdit,
}: {
  sample: Sample;
  handleEdit: (sample: Sample) => void;
}) {
  return (
    <Button variant="outline" size="icon" onClick={() => handleEdit(sample)}>
      <Edit className="h-4 w-4" />
    </Button>
  );
}
