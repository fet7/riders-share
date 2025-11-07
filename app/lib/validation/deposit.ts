import { z } from "zod";

export const DepositSchema = z.object({
  deposit_id: z.string().min(1, "Deposit ID is required"),
  deposit_date: z.coerce.date().refine((date) => !isNaN(date.getTime()), {
    message: "Deposit date is required and must be valid",
  }),
  shareholder_name: z.string().max(255).optional().or(z.literal("")),
  depositor_name: z.string().max(255).optional().or(z.literal("")),
  ref_num: z.string().max(255).optional().or(z.literal("")),
  deposit_amount: z.coerce.number().positive("Deposit amount must be a positive number"),
  bank_name: z.string().max(255).optional().or(z.literal("")),
  account_type: z.enum(["Share", "Saving", "Current", "Other"]).default("Share"),
  general_note: z.string().max(1000).optional().or(z.literal("")),
  created_by: z.string().optional().or(z.literal("")),
  updated_by: z.string().optional().or(z.literal("")),
});

export type Deposit = z.infer<typeof DepositSchema>;
export type DepositCreate = Omit<Deposit, "updated_by"> & { created_by?: string };
export type DepositUpdate = Partial<Omit<Deposit, "created_by">> & { updated_by?: string };
