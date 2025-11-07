import mariadb from "mariadb";

console.log('DB_HOST:', process.env.db_host);
console.log('DB_USER:', process.env.db_user);
console.log('DB_PASSWORD:', process.env.db_password ? '*****' : '<empty>');
console.log('DB_NAME:', process.env.db_name);

const pool = mariadb.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_name,
  port: Number(process.env.db_port || "3306"),
  connectionLimit: 5,
  acquireTimeout: 9000,
  connectTimeout: 9000,
});

export async function query<T = unknown>(
  sql: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[]
): Promise<T[]> {
  let conn;
  try {
    conn = await pool.getConnection();

    if (process.env.NODE_ENV === "development") {
      console.log("Running SQL:", sql, "Params:", params);
    }

    const result = await conn.query(sql, params);
    // Ensure we always return an array
    return Array.isArray(result) ? result : [result];
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}
