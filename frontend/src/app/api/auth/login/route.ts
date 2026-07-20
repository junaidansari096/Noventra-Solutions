import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ detail: "Missing email or password" }, { status: 400 });
    }

    const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `;
    if (users.length === 0) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 401 });
    }

    const user = users[0];
    const isMatch = await verifyPassword(password, user.hashed_password);
    if (!isMatch) {
      return NextResponse.json({ detail: "Incorrect email or password" }, { status: 401 });
    }

    // JWT token compatible with FastAPI sub claim
    const token = await createToken({ sub: user.email });

    const response = NextResponse.json({
      access_token: token,
      token_type: "bearer"
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      maxAge: 1440 * 60, // 24 hours
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
