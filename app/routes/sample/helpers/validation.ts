import { z } from "zod";

export const SampleSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000).optional(),
  image: z.string().optional(),
});

export function validateSampleField<T extends keyof typeof SampleSchema.shape>(
  fieldName: T,
  value: unknown
) {
  return SampleSchema.shape[fieldName].safeParse(value);
}

export type Sample = {
  id: number;
  name: string;
  description: string;
  image?: string;
  created_at: string;
  updated_at: string;
};

export type SampleCreate = Omit<Sample, "id" | "created_at" | "updated_at">;
export type SampleUpdate = Partial<SampleCreate>;
export type SampleDelete = Pick<Sample, "id">;
export type SampleList = Sample[];
export type SampleListResponse = {
  Samples: SampleList;
};
export type SampleCreateResponse = {
  Sample: Sample;
};
export type SampleUpdateResponse = {
  Sample: Sample;
};
export type SampleDeleteResponse = {
  message: string;
};
export type SampleErrorResponse = {
  error: string;
};
export type SampleNotFoundResponse = {
  message: string;
};
export type SampleValidationErrorResponse = {
  message: string;
  errors: {
    [key: string]: string[];
  };
};
export type SampleValidationError = {
  name?: string[];
  description?: string[];
};
export type SampleError = {
  message: string;
  errors?: SampleValidationError;
};