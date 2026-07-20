import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/customer-projects/ -> Returns all customer projects (admin only)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const projects = await sql`
      SELECT cp.*, u.full_name as customer_name, u.email as customer_email
      FROM customer_projects cp
      JOIN users u ON cp.customer_id = u.id
      ORDER BY cp.id ASC
    `;
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/customer-projects/ -> Creates customer project (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customer_id, title, description, progress_percent, status, milestones, domain, hosting_status, renewal_date } = body;

    // Verify customer exists
    const customer = await sql`
      SELECT id FROM users WHERE id = ${customer_id} LIMIT 1
    `;
    if (customer.length === 0) {
      return NextResponse.json({ detail: "Customer not found" }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO customer_projects (
        customer_id, title, description, progress_percent, status, milestones, domain, hosting_status, renewal_date
      )
      VALUES (
        ${customer_id}, ${title}, ${description}, ${progress_percent ?? 0}, ${status ?? "Planning"}, 
        ${milestones ? JSON.stringify(milestones) : null}, ${domain}, ${hosting_status ?? "None"}, ${renewal_date}
      )
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
