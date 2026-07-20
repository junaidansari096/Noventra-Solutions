import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/contacts/ -> Returns all contact submissions (admin only)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const contacts = await sql`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC
    `;
    return NextResponse.json(contacts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/contacts/ -> Submits contact form (public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    const result = await sql`
      INSERT INTO contact_submissions (name, email, message, status, created_at)
      VALUES (${name}, ${email}, ${message}, 'New', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
