import { z } from "zod";

export const ShareholderSchema = z.object({
  shareholder_id: z.string().min(1, "Shareholder ID is required"),
  name_english: z.string().min(1, "Name in English is required").max(255),
  name_amharic: z.string().max(255).optional().or(z.literal("")),
  nationality: z.string().default("ኢትዮጵያዊ"),
  city: z.string().max(255).optional().or(z.literal("")),
  sub_city: z.string().max(255).optional().or(z.literal("")),
  wereda: z.string().max(255).optional().or(z.literal("")),
  house_num: z.string().max(255).optional().or(z.literal("")),
  phone_primary: z.string().max(20).optional().or(z.literal("")),
  phone_secondary: z.string().max(20).optional().or(z.literal("")),
  email: z.email("Invalid email format").optional().or(z.literal("")),
  national_id_num: z.string()
    .refine(val => val === "" || val.length === 16, "Fayda number must be 16 digits")
    .optional()
    .or(z.literal("")),
  general_note: z.string().optional().or(z.literal("")),
  created_by: z.string().optional().or(z.literal("")),
  updated_by: z.string().optional().or(z.literal("")),
});

export type Shareholder = z.infer<typeof ShareholderSchema>;
export type ShareholderCreate = Omit<Shareholder, "updated_by"> & { created_by?: string };
export type ShareholderUpdate = Partial<Omit<Shareholder, "created_by">> & { updated_by?: string };
