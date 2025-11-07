import { z } from "zod";

export const shareholdersSchema = z.object({
  shareholder_id: z.string().min(1, "Shareholder ID is required"),
  name_english: z
    .string()
    .trim()
    .min(1, "Name (English) is required")
    .max(255, "Name (English) must be at most 255 characters"),
  name_amharic: z
    .string()
    .trim()
    .min(1, "Name (Amharic) is required")
    .max(255, "Name (Amharic) must be at most 255 characters"),
  nationality: z.string().trim().max(255).default("ኢትዮጵያዊ"),
  city: z.string().trim().max(255).nullable().optional(),
  sub_city: z.string().trim().max(255).nullable().optional(),
  wereda: z.string().trim().max(255).nullable().optional(),
  house_num: z.string().trim().max(255).nullable().optional(),
  phone_primary: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-()\s]*$/, "Invalid phone number format")
    .nullable()
    .optional(),
  phone_secondary: z.string().max(255).nullable().optional(),
  email: z.email("Invalid email address").nullable().optional(),
  national_id_num: z.string().trim().max(16).nullable().optional(),
  general_note: z.string().trim().nullable().optional(),
  created_by: z.string().trim().max(255).nullable().optional(),
  updated_by: z.string().trim().max(255).nullable().optional(),
});

export type Shareholder = z.infer<typeof shareholdersSchema>;

// validation.ts - Update deposit schema
export const shareholderDepositsSchema = z.object({
  shareholder_id: z.string().min(1, "Shareholder ID is required"),
  deposit_id: z.string().min(1, "Deposit ID is required"),
  transaction_amount: z.coerce
    .number()
    .min(0.00, "Transaction amount must be greater than 0"),
  share_price: z.coerce.number().min(1, "Share price must be at least 1"),
  general_note: z.string().default("").optional(),
  created_by: z.string().default("").optional(),
  updated_by: z.string().default("").optional(),
});

export type ShareholderDeposit = z.infer<typeof shareholderDepositsSchema>;
