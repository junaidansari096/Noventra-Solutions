import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { sql } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SECRET_KEY || "noventra_super_secret_key_change_me_in_production_1234567890"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(request: Request) {
  let token: string | null = null;

  // 1. Check Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // 2. Check Cookie header (FastAPI login sets access_token cookie)
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/access_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  if (!payload || !payload.sub) {
    return null;
  }

  const email = payload.sub as string;
  const users = await sql`
    SELECT id, email, role, full_name 
    FROM users 
    WHERE email = ${email} 
    LIMIT 1
  `;
  
  if (users.length === 0) {
    return null;
  }

  return users[0];
}
