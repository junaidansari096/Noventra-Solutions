import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, discount_percentage, ends_at, is_active, coupon_code } = body;

    const result = await sql`
      UPDATE offers 
      SET 
        title = COALESCE(${title}, title),
        discount_percentage = COALESCE(${discount_percentage}, discount_percentage),
        ends_at = COALESCE(${ends_at}, ends_at),
        is_active = COALESCE(${is_active}, is_active),
        coupon_code = COALESCE(${coupon_code}, coupon_code)
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ detail: "Offer not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const result = await sql`
      DELETE FROM offers 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ detail: "Offer not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
