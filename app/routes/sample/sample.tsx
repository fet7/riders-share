import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { Route } from "./+types/sample";
import { handleAction } from "./helpers/action-handler";
import { DisplayData } from "./helpers/display-data";
import { DisplayForm } from "./helpers/display-form";
import { getAll } from "./helpers/services.server";
import { type Sample } from "./helpers/validation";

// Loader – fetches all samples
export async function loader() {
  const samples = await getAll();
  return { samples };
}

// Action – handles create, update, and delete with switch
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  return handleAction({
    actionType: formData.get("_action") as string,
    id: formData.get("id") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    imageFile: formData.get("image") as File | null,
  });
}

export default function SamplePage({ loaderData }: Route.ComponentProps) {
  const { samples } = loaderData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSample, setEditSample] = useState<Sample | null>(null);

  const handleInsert = () => {
    setEditSample(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <Link to="/">🏠</Link>
        <h1 className="text-xl font-bold">📦 Samples</h1>
        <Button onClick={handleInsert}>+ Create New Sample</Button>
      </div>

      <DisplayData
        samples={samples}
        setEditSample={setEditSample}
        setIsModalOpen={setIsModalOpen}
      />

      <DisplayForm
        editSample={editSample}
        isModalOpen={isModalOpen}
        setEditSample={setEditSample}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
