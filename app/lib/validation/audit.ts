import { z } from "zod";

export const AuditLogSchema = z.object({
  log_id: z.number().int().positive().optional(), // Auto-generated, optional for creation
  user_id: z.string().uuid("Invalid user ID format").nullable(),
  action: z.string().min(1, "Action is required").max(100, "Action too long"),
  resource: z.string().min(1, "Resource is required").max(100, "Resource too long"),
  status: z.enum(["allowed", "denied"]),
  ip_address: z.string().min(1, "Invalid IP address"),
  user_agent: z.string().optional(),
  timestamp: z.iso.datetime().optional(), // Auto-generated
  details: z.record(z.string(), z.any()).optional(), // Flexible JSON data
});

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogCreate = Omit<AuditLog, "log_id" | "timestamp">;

// Common audit actions for consistency
export const AuditActions = {
  // Authentication actions
  LOGIN: "login",
  LOGOUT: "logout",
  REGISTER: "register",
  PASSWORD_RESET: "password_reset",

  // User management actions
  USER_APPROVE: "user_approve",
  USER_SUSPEND: "user_suspend",
  ROLE_CHANGE: "role_change",

  // Authorization actions
  PERMISSION_DENIED: "permission_denied",
  ROLE_ESCALATION_ATTEMPT: "role_escalation_attempt",

  // Data access actions
  DATA_READ: "data_read",
  DATA_WRITE: "data_write",
  DATA_DELETE: "data_delete",
} as const;

// Common resources for consistency
export const AuditResources = {
  USERS: "users",
  SESSIONS: "sessions",
  SHAREHOLDERS: "shareholders",
  DEPOSITS: "deposits",
  SYSTEM: "system",
} as const;
