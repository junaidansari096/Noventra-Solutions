import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/services/ -> Returns active services (public)
export async function GET() {
  try {
    const services = await sql`
      SELECT * FROM services 
      WHERE is_active = true 
      ORDER BY id ASC
    `;
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/services/ -> Creates a service (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, price_range, icon, features, is_active } = body;

    const result = await sql`
      INSERT INTO services (title, description, price_range, icon, features, is_active)
      VALUES (${title}, ${description}, ${price_range}, ${icon}, ${JSON.stringify(features)}, ${is_active ?? true})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
