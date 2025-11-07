import { query } from "../services/db.server";
import type { Session, SessionCreate } from "../validation/session";
import { createId } from "@paralleldrive/cuid2";

export class SessionService {
    private static SESSION_DURATION = 15 * 60 * 1000;

    /**
     * create a new session for a user
     */
    static async createSession(sessionData: Omit<SessionCreate, "session_id">): Promise<Session>{
        const sessionId = createId();

        const sql = `
            INSERT INTO user_sessions (session_id, user_id, expires_at, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `;

        await query(sql, [
            sessionId,
            sessionData.user_id,
            sessionData.expires_at,
            sessionData.ip_address,
            sessionData.user_agent || null,
        ]);

        return {
            session_id: sessionId,
            ...sessionData,
        };
    }

    /**
     * validate and get session by ID
     */
    static async getValidSession(sessionId: string): Promise<Session | null> {
      const sql = `
        SELECT * FROM user_sessions
        WHERE session_id = ? AND expires_at > NOW()
      `;

    const results = await query<Session>(sql, [sessionId]);
      return results[0] || null;
    }

  /**
   * Delete a session (logout)
   */
   static async deleteSession(sessionId: string): Promise<void> {
    await query(
      "DELETE FROM user_sessions WHERE session_id = ?",
      [sessionId]
    );
  }

   /**
   * Delete all sessions for a user
   */
  static async deleteAllUserSessions(userId: string): Promise<void> {
    await query(
      "DELETE FROM user_sessions WHERE user_id = ?",
      [userId]
    );
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<void> {
    await query(
      "DELETE FROM user_sessions WHERE expires_at <= NOW()"
    );
  }

  /**
   * Create session data for a user (convenience method)
   */
  static async createUserSession(
    userId: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<Session> {
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    return this.createSession({
      user_id: userId,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  /**
   * Extend session expiration
   */
  static async extendSession(sessionId: string): Promise<void> {
    const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION);

    await query(
      "UPDATE user_sessions SET expires_at = ? WHERE session_id = ?",
      [newExpiresAt.toISOString(), sessionId]
    );
  }

  /**
   * Get all active sessions for a user
   */
  static async getUserSessions(userId: string): Promise<Session[]> {
    const results = await query<Session>(
      "SELECT * FROM user_sessions WHERE user_id = ? AND expires_at > NOW() ORDER BY created_at DESC",
      [userId]
    );
    return results;
  }
}

// Convenience functions
export async function createSession(sessionData: Omit<SessionCreate, "session_id">): Promise<Session> {
  return SessionService.createSession(sessionData);
}

export async function getValidSession(sessionId: string): Promise<Session | null> {
  return SessionService.getValidSession(sessionId);
}

export async function deleteSession(sessionId: string): Promise<void> {
  return SessionService.deleteSession(sessionId);
}

export async function createUserSession(
  userId: string,
  ipAddress: string,
  userAgent?: string
): Promise<Session> {
  return SessionService.createUserSession(userId, ipAddress, userAgent);
}
