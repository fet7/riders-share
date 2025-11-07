import { z } from "zod";

interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    errors?: any
}
export async function validateAndHandleAction<T>({
  actionType,
  id,
  data,
  schema,
  createFn,
  updateFn,
  deleteFn,
}: {
  actionType: string;
  id?: string;
  data: any;
  schema: z.ZodSchema<T>;
  createFn: (data: T) => Promise<any>;
  updateFn: (id: string, data: Partial<T>) => Promise<any>;
  deleteFn: (id: string) => Promise<any>;
}): Promise<ApiResponse> {
  try {
    switch (actionType) {
      case "create": {
        const validation = schema.safeParse(data);
        if (!validation.success) {
          const errorsTree = z.treeifyError(validation.error);
          return { success: false, errors: errorsTree };
        }
        await createFn(validation.data);
        return { success: true };
      }

      case "update": {
        if (!id) return { success: false, error: "ID is required for update" };

        const updateSchema = (schema as any).partial();
        const validation = updateSchema.safeParse(data);
        if (!validation.success) {
          const errorsTree = z.treeifyError(validation.error);
          return { success: false, errors: errorsTree };
        }
        await updateFn(id, validation.data);
        return { success: true };
      }

      case "delete": {
        if (!id) return { success: false, error: "ID is required for delete" };
        await deleteFn(id);
        return { success: true };
      }

      default:
        return { success: false, error: "Unknown action" };
    }
  } catch (error) {
    console.error("Action handler error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
