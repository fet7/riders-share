import { unlink } from "fs/promises";
import path from "path";
import { deleteData, insertData, selectImage, updateData } from "./services.server";
import { validateSample } from "./validate-sample";
import { saveImage } from "./save-image";

/**
 * Handles create, update, and delete operations for samples.
 * This is extracted for readability and testability.
 */
export async function handleAction({
  actionType,
  id,
  name,
  description,
  imageFile,
}: {
  actionType: string;
  id: string;
  name: string;
  description: string;
  imageFile: File | null;
}) {
  const isInvalidId = !/^\d+$/.test(id);

  switch (actionType) {
    case "delete": {
      if (isInvalidId) return { error: "Invalid ID", status: 400 };

      const [existing] = await selectImage({ id });
      if (!existing) return { success: false, error: "Sample not found" };

      try {
        if (existing.image) {
          const imagePath = path.join(process.cwd(), "public", existing.image);
          try {
            await unlink(imagePath);
          } catch {
            console.warn("Image not found or already deleted:", imagePath);
          }
        }
        await deleteData({ id });
        return { success: true };
      } catch (err) {
        console.error("Failed to delete sample or image:", err);
        return { success: false, error: "Failed to delete sample" };
      }
    }

    case "update": {
      if (isInvalidId) return { error: "Invalid ID", success: false };

      const validation = await validateSample(name, description);
      if (validation.errors) return validation;

      await updateData({
        name: validation.data.name,
        description: validation.data.description,
        id,
      });
      return { success: true };
    }

    case "create": {
      const validation = await validateSample(name, description);
      if (validation.errors) return validation;

      const imagePath = await saveImage(imageFile);

      await insertData({
        name: validation.data.name,
        description: validation.data.description,
        image: imagePath,
      });
      return { success: true };
    }

    default:
      return { success: false, error: "Unknown action" };
  }
}
