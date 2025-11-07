import { z } from "zod";

import { saveImage } from "~/routes/sample/helpers/save-image";
import {
  deleteShareholder,
  getShareholderById,
  insertShareholder,
  updateShareholder,
} from "./services.server";
import { shareholdersSchema } from "./validation";

/**
 * Handles create, update, and delete operations for shareholder.
 */
export async function handleAction({
  actionType,
  shareholder_id,
  data,
  imageFile,
}: {
  actionType: "create" | "update" | "delete";
  shareholder_id?: string;
  data?: Partial<z.infer<typeof shareholdersSchema>>;
  imageFile?: File | null;
}) {
  const isInvalidId = !shareholder_id || shareholder_id.trim() === "";

  switch (actionType) {
    // 🗑️ DELETE SHAREHOLDER
    case "delete": {
      if (isInvalidId)
        return { success: false, error: "Invalid or missing Shareholder ID" };

      const existing = await getShareholderById(shareholder_id);
      if (!existing) return { success: false, error: "Shareholder not found" };

      try {
        // // Optional: if you store shareholder photo paths
        // if (existing.image) {
        //   const imagePath = path.join(process.cwd(), "public", existing.image);
        //   try {
        //     await unlink(imagePath);
        //   } catch {
        //     console.warn("Image not found or already deleted:", imagePath);
        //   }
        // }

        await deleteShareholder(shareholder_id);
        return { success: true };
      } catch (err) {
        console.error("Failed to delete shareholder:", err);
        return { success: false, error: "Failed to delete shareholder" };
      }
    }

    // ✏️ UPDATE SHAREHOLDER
    case "update": {
      if (isInvalidId)
        return { success: false, error: "Invalid or missing Shareholder ID" };
      if (!data)
        return { success: false, error: "No shareholder data provided" };

      const parsed = shareholdersSchema.safeParse({ ...data, shareholder_id });
      if (!parsed.success) {
        return {
          success: false,
          errors: z.flattenError(parsed.error).fieldErrors,
          fields: data,
        };
      }

      let imagePath: string | undefined;
      if (imageFile) {
        imagePath = await saveImage(imageFile);
      }

      await updateShareholder({
        ...parsed.data,
        ...(imagePath && { image: imagePath }),
      });

      // ✅ Return the updated shareholder data
      const updatedShareholder = await getShareholderById(shareholder_id);
      return { success: true, shareholder: updatedShareholder };
    }

    // ➕ CREATE SHAREHOLDER
    case "create": {
      if (!data)
        return { success: false, error: "No shareholder data provided" };

      const parsed = shareholdersSchema.safeParse(data);
      if (!parsed.success) {
        return {
          success: false,
          errors: z.flattenError(parsed.error).fieldErrors,
          fields: data,
        };
      }

      let imagePath: string | undefined;
      if (imageFile) {
        imagePath = await saveImage(imageFile);
      }

      await insertShareholder({
        ...parsed.data,
        ...(imagePath && { image: imagePath }),
      });

      // ✅ Get the inserted shareholder ID and return the full data
      const newShareholder = await getShareholderById(
        parsed.data.shareholder_id
      );
      return { success: true, shareholder: newShareholder };
    }

    // ❓ UNKNOWN ACTION
    default:
      return { success: false, error: "Unknown action type" };
  }
}
