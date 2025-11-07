import { z } from "zod";

export const UserDBSchema = z.object({
  user_id: z.uuid("Invalid user ID format"),
  full_name: z.string()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .transform((email) => email.toLowerCase()),
  phone: z.string()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  password_hash: z.string().min(1, "Password hash is required"), // Changed from password to password_hash
  role: z.enum(["unassigned", "admin", "master_clerk", "transfer_officer", "auditor", "shareholder", "attendance_clerk", "shareholder_clerk", "deposit_clerk", "shareholder_deposit_clerk", "receipt_clerk"]).default("unassigned"),
  status: z.enum(["pending_approval", "active", "suspended"]).default("pending_approval"),
  created_at: z.date().or(z.string()).optional(),
  updated_at: z.date().or(z.string()).optional(),
  last_login: z.date().or(z.string()).nullable().optional(),
  approved_by: z.uuid().nullable().optional(),
  approved_at: z.date().or(z.string()).nullable().optional(),
});

// User type from database (with password_hash)
export type UserDB = z.infer<typeof UserDBSchema>;

// User type for API responses (without password_hash)
export type User = Omit<UserDB, 'password_hash'>;

// User creation type (with plain password)
export type UserCreate = Omit<UserDB, "user_id" | "password_hash" | "created_at" | "updated_at" | "last_login" | "approved_by" | "approved_at"> & {
  password: string;
};

export type UserUpdate = Partial<Omit<UserDB, "user_id" | "created_at">> & {
  updated_by?: string;
  password?: string;
};

// Validation schemas for forms (with password field)
export const UserRegistrationSchema = z.object({
  full_name: z.string()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters")
    .transform((email) => email.toLowerCase()),
  phone: z.string()
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^\+?[0-9\s\-\(\)]+$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirm_password: z.string()
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export const UserLoginSchema = z.object({
  email: z
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// Keep your existing schemas for admin and first admin
export const UserAdminSchema = UserDBSchema.omit({
  password_hash: true,
}).extend({
  role: UserDBSchema.shape.role,
  status: UserDBSchema.shape.status,
});

export const FirstAdminSchema = UserRegistrationSchema.omit({
  confirm_password: true,
});
