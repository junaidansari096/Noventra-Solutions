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
    const { title, description, progress_percent, status, milestones, domain, hosting_status, renewal_date } = body;

    const result = await sql`
      UPDATE customer_projects 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        progress_percent = COALESCE(${progress_percent}, progress_percent),
        status = COALESCE(${status}, status),
        milestones = COALESCE(${milestones ? JSON.stringify(milestones) : null}, milestones),
        domain = COALESCE(${domain}, domain),
        hosting_status = COALESCE(${hosting_status}, hosting_status),
        renewal_date = COALESCE(${renewal_date}, renewal_date)
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json({ detail: "Customer project not found" }, { status: 404 });
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
      DELETE FROM customer_projects 
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json({ detail: "Customer project not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
