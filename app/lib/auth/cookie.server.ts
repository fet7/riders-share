import { createCookieSessionStorage } from "react-router";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set in environment variables");
}

// Create session storage
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secrets: [sessionSecret],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes in seconds
    path: "/",
  },
});

// Get session from request
export async function getSession(request: Request) {
  return await sessionStorage.getSession(request.headers.get("Cookie"));
}

// Get user from session
export async function getUser(request: Request) {
  const session = await getSession(request);
  return session.get("user") || null;
}

// Create a new session with user data
export async function createUserSession(user: any) {
  const session = await sessionStorage.getSession();
  session.set("user", user);
  return session;
}

// Commit session and get Set-Cookie header
export async function commitSession(session: any) {
  return await sessionStorage.commitSession(session);
}

// Destroy session (logout)
export async function destroySession(session: any) {
  return await sessionStorage.destroySession(session);
}
