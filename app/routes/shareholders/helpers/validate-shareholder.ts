import { z } from "zod";
import { shareholdersSchema, type Shareholder } from "./validation";

export async function validateShareholder(data: Partial<Shareholder>) {
  const result = shareholdersSchema.safeParse(data);

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
