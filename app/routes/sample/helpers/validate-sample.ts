import { z } from "zod";
import { SampleSchema } from "./validation";

export async function validateSample(name: string, description: string) {
  const result = SampleSchema.safeParse({ name, description });
  if (!result.success) {
    return {
      errors: z.flattenError(result.error).fieldErrors,
      fields: { name, description },
      success: false,
    };
  }
  return { data: result.data };
}