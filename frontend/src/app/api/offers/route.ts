import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/offers/ -> Returns active offers (public)
export async function GET() {
  try {
    const offers = await sql`
      SELECT * FROM offers 
      WHERE is_active = true 
      ORDER BY id ASC
    `;
    return NextResponse.json(offers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/offers/ -> Creates an offer (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, discount_percentage, ends_at, is_active, coupon_code } = body;

    const result = await sql`
      INSERT INTO offers (title, discount_percentage, ends_at, is_active, coupon_code)
      VALUES (${title}, ${discount_percentage}, ${ends_at}, ${is_active ?? true}, ${coupon_code})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
