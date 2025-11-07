// app/helpers/validation.ts
import { z } from "zod";

export const depositSchema = z.object({
  deposit_id: z
    .string()
    .trim()
    .min(1, "Deposit ID is required")
    .max(255, " Maximum 255 characters is allowed"),
  deposit_date: z.coerce.date(),
  shareholder_name: z.string().trim().max(255).nullable().optional(),
  depositor_name: z.string().trim().max(255).nullable().optional(),
  ref_num: z.string().trim().max(255).nullable().optional(),
  deposit_amount: z.number().min(0.0, "Deposit amount must be greater than 0"),
  bank_name: z.string().trim().min(1, "Bank name is required").max(255),
  account_type: z.string().default("Share"),
  general_note: z.string().trim().nullable().optional(),
  created_by: z.string().trim().max(255).nullable().optional(),
  updated_by: z.string().trim().max(255).nullable().optional(),
});

export type Deposit = z.infer<typeof depositSchema>;
