import { hashPassword, verifyPassword, needsRehash } from "../auth/password.server";
import { query } from "../services/db.server";
import type { User, UserCreate, UserDB, UserUpdate } from "../validation/user";

export async function getAllUsers(): Promise<User[]> {
    const results = await query<UserDB>(
        "SELECT * FROM users ORDER BY created_at DESC"
    );
    return results.map(({password_hash, ...user }) => user);
}

export async function getUserByID(id: string): Promise<User | null> {
    const results = await query<UserDB>(
        "SELECT * FROM users WHERE user_id=?", [id]
    );
    const user = results[0] ?? null;
    if(!user) return null;

    const {password_hash, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const results = await query<UserDB>(
        "SELECT * FROM users WHERE email=?",[email.toLowerCase()]
    );
    const user = results[0] ?? null;
    if(!user) return null;

    const {password_hash, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

// Internal function to get user WITH password hash (for authentication)
export async function getUserWithPasswordByEmail(email: string): Promise<UserDB | null> {
    const results = await query<UserDB>(
        "SELECT * FROM users WHERE email=?",[email.toLowerCase()]
    );
    return results[0] ?? null;
}

export async function createUser(data: UserCreate): Promise<User> {

    const existingUser = await getUserByEmail(data.email);
        if(existingUser) {
            throw new Error("Email already registered")
        }

    const passwordHash = await hashPassword(data.password);

    const sql = `
    INSERT INTO users
    ( user_id, full_name, email, phone, password_hash, role, status)
    VALUES(UUID(), ?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [
        data.full_name,
        data.email.toLowerCase(),
        data.phone || null,
        passwordHash,
        data.role ?? 'unassigned',
        data.status ?? 'pending_approval',
    ]);

    // get the newly created user
    const inserted = await getUserByEmail(data.email);
    if(!inserted) {
        throw new Error('Failed to create user');
    }

    return inserted;
}

export async function updateUser(id: string, data: UserUpdate): Promise<User> {

    const params: any[] = [];
    const sets: string[] = [];

    if (data.full_name !== undefined) { sets.push("full_name = ?"); params.push(data.full_name); }
    if (data.email !== undefined) { sets.push("email = ?"); params.push(data.email.toLowerCase()); }
    if (data.phone !== undefined) { sets.push("phone = ?"); params.push(data.phone ?? null); }
    if (data.role !== undefined) { sets.push("role = ?"); params.push(data.role); }
    if (data.status !== undefined) { sets.push("status = ?"); params.push(data.status); }

    if (data.password) {
        const passwordHash = await hashPassword(data.password);
        sets.push("password_hash = ?");
        params.push(passwordHash);
    }

    sets.push("updated_at = CURRENT_TIMESTAMP");

    if (sets.length === 0) {
        throw new Error("No fields to update");
    }

    const sql = `UPDATE users SET ${sets.join(", ")} WHERE user_id = ?`;
    params.push(id);

    await query(sql, params);

    const updated = await getUserByID(id);
    if (!updated) throw new Error("Failed to update user");

    return updated;
}

export async function deleteUser(id: string): Promise<void> {
    await query("DELETE FROM users WHERE user_id=?", [id]);
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
    const user = await getUserWithPasswordByEmail(email);
    if(!user) return null;

    const isValid = await verifyPassword(password, user.password_hash);
    if(!isValid) return null;

    if( await needsRehash(user.password_hash)) {
        await updateUserPassword(user.user_id, password)
    }

    const {password_hash, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await hashPassword(newPassword);

    await query(
        "UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?", [passwordHash, userId]
    );
}

export async function approveUser(
  userId: string,
  role: User['role'],
  approvedBy: string
): Promise<User> {
  const sql = `
    UPDATE users
    SET role = ?, status = 'active', approved_by = ?, approved_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;

  await query(sql, [role, approvedBy, userId]);

  const updatedUser = await getUserByID(userId);
  if (!updatedUser) {
    throw new Error("Failed to approve user");
  }

  return updatedUser;
}

export async function pendingUsers(): Promise<User []> {
    return await query<UserDB>(
        "SELECT * FROM users WHERE status = 'pending_approval' ORDER BY created_at ASC"
    );
}

export async function getActiveUsers(): Promise<User[]> {
    return await query<UserDB>(
        "SELECT * FROM users WHERE status = 'active' ORDER BY full_name"
    );
}

export async function updateLastLogin(userId: string): Promise<void> {
    await query(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?", [userId]
    );
}

export async function emailExists(email: string): Promise<boolean> {
    const user = await getUserByEmail(email);
    return !!user;
}
