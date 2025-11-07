import { query } from "../services/db.server";
import type { AuditLogCreate } from "~/lib/validation/audit";

export class AuditService {
  /**
   * Log an authentication/authorization event
   */
  static async logEvent(auditData: AuditLogCreate): Promise<void> {
    const sql = `
      INSERT INTO auth_audit_logs (user_id, action, resource, status, ip_address, user_agent, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await query(sql, [
      auditData.user_id,
      auditData.action,
      auditData.resource,
      auditData.status,
      auditData.ip_address,
      auditData.user_agent || null,
      auditData.details ? JSON.stringify(auditData.details) : null,
    ]);
  }

  /**
   * Convenience method for signin attempts
   */
  static async logLoginAttempt(
    userId: string | null,
    ipAddress: string,
    userAgent: string | undefined,
    status: "allowed" | "denied",
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      user_id: userId,
      action: "login",
      resource: "sessions",
      status,
      ip_address: ipAddress,
      user_agent: userAgent,
      details,
    });
  }

  /**
   * Convenience method for authorization checks
   */
  static async logAuthorization(
    userId: string,
    action: string,
    resource: string,
    status: "allowed" | "denied",
    ipAddress: string,
    details?: Record<string, any>
  ): Promise<void> {
    await this.logEvent({
      user_id: userId,
      action,
      resource,
      status,
      ip_address: ipAddress,
      user_agent: undefined,
      details,
    });
  }

  /**
   * Get audit logs for a user
   */
  static async getUserAuditLogs(userId: string, limit: number = 50): Promise<any[]> {
    return await query(
      "SELECT * FROM auth_audit_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?",
      [userId, limit]
    );
  }
}

// Convenience functions
export async function logAuthorization(
  userId: string,
  action: string,
  resource: string,
  status: "allowed" | "denied",
  ipAddress: string,
  details?: Record<string, any>
): Promise<void> {
  return AuditService.logAuthorization(userId, action, resource, status, ipAddress, details);
}

export async function logEvent(auditData: AuditLogCreate): Promise<void> {
  return AuditService.logEvent(auditData);
}

export async function logLoginAttempt(
  userId: string | null,
  ipAddress: string,
  userAgent: string | undefined,
  status: "allowed" | "denied",
  details?: Record<string, any>
): Promise<void> {
  return AuditService.logLoginAttempt(userId, ipAddress, userAgent, status, details);
}
