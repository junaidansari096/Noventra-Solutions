import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password || !full_name) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    // Check if email exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;
    if (existing.length > 0) {
      return NextResponse.json({ detail: "Email already registered" }, { status: 400 });
    }

    // Check if first user to set admin role
    const totalUsers = await sql`
      SELECT COUNT(*)::int as count FROM users
    `;
    const role = totalUsers[0].count === 0 ? "admin" : "customer";

    const hashedPw = await hashPassword(password);

    const result = await sql`
      INSERT INTO users (email, hashed_password, full_name, role, created_at)
      VALUES (${email}, ${hashedPw}, ${full_name}, ${role}, CURRENT_TIMESTAMP)
      RETURNING id, email, full_name, role, created_at
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
