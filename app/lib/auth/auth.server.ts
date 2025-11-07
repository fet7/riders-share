import { verifyUserCredentials, getUserByEmail, createUser } from "~/lib/api/users.server";
import { logLoginAttempt, logAuthorization } from "./audit.server";
import { query } from "../services/db.server";
import {
  getSession,
  getUser,
  createUserSession,
  commitSession,
  destroySession
} from "./cookie.server";

export const validRoles = [
  'unassigned',
  'admin',
  'master_clerk',
  'transfer_officer',
  'auditor',
  'shareholder',
  'attendance_clerk',
  'shareholder_clerk',
  'deposit_clerk',
  'shareholder_deposit_clerk',
  'receipt_clerk'
] as const;

export const validStatuses = [
  'pending_approval',
  'active',
  'suspended'
] as const;

export type UserRole = typeof validRoles[number];
export type UserStatus = typeof validStatuses[number];

// Type guard functions to validate inputs
function isValidRole(role: string): role is UserRole {
  return validRoles.includes(role as UserRole);
}

function isValidStatus(status: string): status is UserStatus {
  return validStatuses.includes(status as UserStatus);
}

/**
 * Helper function to check if there is an existing user
 * @returns boolean
 */
export async function hasExistingUsers(): Promise<boolean> {
  const result = await query<{count: number}>(
    "SELECT COUNT(*) as count FROM users"
  );
  return result[0]?.count > 0;
}

export class AuthService {
    /**
   * Public registration - only works when no users exist
   */
  static async publicRegister(
    data: { full_name: string; email: string; phone?: string; password: string },
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if users already exist
      const usersExist = await hasExistingUsers();
      if (usersExist) {
        return {
          success: false,
          error: "Public registration is disabled. Please contact an administrator."
        };
      }

      const email = data.email.toLowerCase();

      // Check existing user
      const existing = await getUserByEmail(email);
      if (existing) {
        await logLoginAttempt(null, ipAddress ?? "unknown", userAgent, "denied", {
          email,
          reason: "email_exists",
        });
        return { success: false, error: "Email already registered" };
      }

      // Create first user as system administrator (auto-approved)
      await createUser({
        full_name: data.full_name,
        email,
        phone: data.phone,
        password: data.password,
        role: 'admin',
        status: 'active'
      });

      // Log the first user creation
      const created = await getUserByEmail(email);
      if (created) {
        await logLoginAttempt(created.user_id, ipAddress ?? "unknown", userAgent, "allowed", {
          email,
          action: "first_user_created",
          role: "system_administrator"
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("AuthService.publicRegister error:", err);
      return { success: false, error: "Registration failed. Please try again." };
    }
  }

  /**
   * Admin-only user creation
   */
  static async adminCreateUser(
    data: {
      full_name: string;
      email: string;
      phone?: string;
      password: string;
      role: string;
      status: string;
    },
    createdBy: string, // Admin user ID who is creating this account
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate role and status
      if (!isValidRole(data.role)) {
        return {
          success: false,
          error: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        };
      }

      if (!isValidStatus(data.status)) {
        return {
          success: false,
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        };
      }
      const email = data.email.toLowerCase();

      // Check existing user
      const existing = await getUserByEmail(email);
      if (existing) {
        await logLoginAttempt(null, ipAddress ?? "unknown", userAgent, "denied", {
          email,
          reason: "email_exists",
          createdBy
        });
        return { success: false, error: "Email already registered" };
      }

      // Create user with specified role and status
      await createUser({
        full_name: data.full_name,
        email,
        phone: data.phone,
        password: data.password,
        role: data.role,
        status: data.status
      });

      // Log admin user creation
      const created = await getUserByEmail(email);
      if (created) {
        await logLoginAttempt(created.user_id, ipAddress ?? "unknown", userAgent, "allowed", {
          email,
          action: "user_created_by_admin",
          createdBy,
          role: data.role,
          status: data.status
        });
      }

      return { success: true };
    } catch (err: any) {
      console.error("AuthService.adminCreateUser error:", err);
      return { success: false, error: "User creation failed. Please try again." };
    }
  }

  /**
   * Authenticate user and create session
   */
  static async signin(
    email: string,
    password: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<{ success: boolean; user?: any; error?: string; cookie?: string }> {
    try {
      const user = await verifyUserCredentials(email, password);

      if (!user) {
        await logLoginAttempt(null, ipAddress, userAgent, "denied", {
          email,
          reason: "invalid_credentials"
        });
        return { success: false, error: "Invalid email or password" };
      }

      // Check if user is approved
      if (user.status !== "active") {
        await logLoginAttempt(user.user_id, ipAddress, userAgent, "denied", {
          email,
          reason: "account_not_active",
          status: user.status
        });
        return { success: false, error: "Account pending approval" };
      }

      // Create session with user data (excluding sensitive fields)
      const safeUser = {...user};
      if('password' in safeUser) {
        delete (safeUser as any).password;
      }
      const session = await createUserSession(safeUser);
      const cookie = await commitSession(session);

      // Log successful signin
      await logLoginAttempt(user.user_id, ipAddress, userAgent, "allowed", {
        email,
        role: user.role
      });

      return {
        success: true,
        user: safeUser,
        cookie
      };
    } catch (error) {
      console.error("Signin error:", error);
      return { success: false, error: "Signin failed" };
    }
  }

  /**
   * Logout user by destroying session
   */
  static async signout(request: Request): Promise<string> {
    const session = await getSession(request);
    const user = session.get("user");

    if (user) {
      await logLoginAttempt(user.user_id, "unknown", undefined, "allowed", {
        action: "signout"
      });
    }

    return await destroySession(session);
  }

  /**
   * Get authenticated user from request
   */
  static async getAuthenticatedUser(request: Request): Promise<any> {
    try {
      const user = await getUser(request);

      if (!user || user.status !== "active") {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  /**
   * Require authentication middleware
   */
  static async requireAuth(request: Request): Promise<any> {
    const user = await this.getAuthenticatedUser(request);

    if (!user) {
      throw new Response("Unauthorized", { status: 401 });
    }

    return user;
  }

  /**
   * Check if user has required role
   */
  static async requireRole(request: Request, requiredRole: string): Promise<any> {
    const user = await this.requireAuth(request);

    if (user.role !== requiredRole) {
      const ipAddress = request.headers.get("CF-Connecting-IP") ||
                       request.headers.get("X-Forwarded-For") ||
                       "unknown";

      await logAuthorization(
        user.user_id,
        "access_denied",
        "system",
        "denied",
        ipAddress,
        {
          requiredRole,
          userRole: user.role,
          path: new URL(request.url).pathname
        }
      );

      throw new Response("Forbidden", { status: 403 });
    }

    return user;
  }
}

// Convenience functions
export async function publicRegister(
  data: { full_name: string; email: string; phone?: string; password: string },
  ipAddress?: string,
  userAgent?: string
) {
  return AuthService.publicRegister(data, ipAddress, userAgent);
}

export async function adminCreateUser(
  data: {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    role: string;
    status: string;
  },
  createdBy: string,
  ipAddress?: string,
  userAgent?: string
) {
  return AuthService.adminCreateUser(data, createdBy, ipAddress, userAgent);
}

export async function signin(
  email: string,
  password: string,
  ipAddress: string,
  userAgent?: string
) {
  return AuthService.signin(email, password, ipAddress, userAgent);
}

export async function signout(request: Request) {
  return AuthService.signout(request);
}

export async function getAuthenticatedUser(request: Request) {
  return AuthService.getAuthenticatedUser(request);
}

export async function requireAuth(request: Request) {
  return AuthService.requireAuth(request);
}

export async function requireRole(request: Request, requiredRole: string) {
  return AuthService.requireRole(request, requiredRole);
}
