import { z } from "zod";
import { depositSchema, type Deposit } from "./validation";

export async function validateDeposit(data: Partial<Deposit>) {
  const result = depositSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
      fields: data,
      success: false as const,
    };
  }

  return {
    data: result.data,
    success: true as const,
  };
}
