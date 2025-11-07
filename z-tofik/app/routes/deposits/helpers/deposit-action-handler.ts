// app/helpers/deposit-action-handler.ts
import {
  deleteDeposit,
  getDepositById,
  insertDeposit,
  updateDeposit,
} from "./deposit-services.server";
import { depositSchema, type Deposit } from "./validation";

/**
 * Handles create, update, and delete operations for deposits.
 */
export async function handleDepositAction({
  actionType,
  deposit_id,
  data,
}: {
  actionType: "create" | "update" | "delete";
  deposit_id?: string;
  data?: Partial<Deposit>;
}) {
  const isInvalidId = !deposit_id || deposit_id.trim() === "";

  switch (actionType) {
    // 🗑️ DELETE DEPOSIT
    case "delete": {
      if (isInvalidId)
        return { success: false, error: "Invalid or missing Deposit ID" };

      const existing = await getDepositById(deposit_id);
      if (!existing) return { success: false, error: "Deposit not found" };

      try {
        await deleteDeposit(deposit_id);
        return { success: true };
      } catch (err) {
        console.error("Failed to delete deposit:", err);
        return { success: false, error: "Failed to delete deposit" };
      }
    }

    // ✏️ UPDATE DEPOSIT
    case "update": {
      if (isInvalidId)
        return { success: false, error: "Invalid or missing Deposit ID" };
      if (!data) return { success: false, error: "No deposit data provided" };

      // Convert deposit_amount to number
      const processedData = {
        ...data,
        deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : 0,
      };

      const parsed = depositSchema.safeParse({ ...processedData, deposit_id });
      if (!parsed.success) {
        return {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          fields: data,
        };
      }

      await updateDeposit(parsed.data);

      // ✅ Return the updated deposit data
      const updatedDeposit = await getDepositById(deposit_id);
      return { success: true, deposit: updatedDeposit };
    }

    // ➕ CREATE DEPOSIT
    case "create": {
      if (!data) return { success: false, error: "No deposit data provided" };

      // Convert deposit_amount to number
      const processedData = {
        ...data,
        deposit_amount: data.deposit_amount ? Number(data.deposit_amount) : 0,
      };

      const parsed = depositSchema.safeParse(processedData);
      if (!parsed.success) {
        return {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          fields: data,
        };
      }

      await insertDeposit(parsed.data);

      // ✅ Get the inserted deposit ID and return the full data
      const newDeposit = await getDepositById(parsed.data.deposit_id);
      return { success: true, deposit: newDeposit };
    }

    // ❓ UNKNOWN ACTION
    default:
      return { success: false, error: "Unknown action type" };
  }
}
