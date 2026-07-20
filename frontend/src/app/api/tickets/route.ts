import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/tickets/ -> List tickets (if admin, list all; if customer, list theirs)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    let tickets;
    if (user.role === "admin") {
      tickets = await sql`
        SELECT t.*, u.full_name as customer_name, u.email as customer_email
        FROM support_tickets t
        JOIN users u ON t.customer_id = u.id
        ORDER BY t.created_at DESC
      `;
    } else {
      tickets = await sql`
        SELECT * FROM support_tickets 
        WHERE customer_id = ${user.id} 
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json(tickets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/tickets/ -> Create support ticket
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subject } = body;

    const result = await sql`
      INSERT INTO support_tickets (customer_id, subject, status, created_at)
      VALUES (${user.id}, ${subject}, 'Open', CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
