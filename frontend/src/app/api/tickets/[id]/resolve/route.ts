import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// PUT /api/tickets/[id]/resolve -> Resolves the ticket
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify ticket exists
    const tickets = await sql`
      SELECT * FROM support_tickets WHERE id = ${id} LIMIT 1
    `;
    if (tickets.length === 0) {
      return NextResponse.json({ detail: "Ticket not found" }, { status: 404 });
    }

    const ticket = tickets[0];

    // Restrict if not owner and not admin
    if (user.role !== "admin" && ticket.customer_id !== user.id) {
      return NextResponse.json({ detail: "Not authorized to resolve this ticket" }, { status: 403 });
    }

    const result = await sql`
      UPDATE support_tickets 
      SET status = 'Resolved'
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
