import { z } from "zod";

export const SessionSchema = z.object({
  session_id: z.string().min(1, "Session ID is required"),
  user_id: z.uuid("Invalid user ID format"),
  expires_at: z.iso.datetime("Invalid expiration date"),
  ip_address: z.string().min(1, "Invalid IP address"),
  user_agent: z.string().optional(),
});

export type Session = z.infer<typeof SessionSchema>;
export type SessionCreate = Omit<Session, "session_id">;
