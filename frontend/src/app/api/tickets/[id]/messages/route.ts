import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// POST /api/tickets/[id]/messages -> Sends a chat message inside ticket
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { message } = body;

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
      return NextResponse.json({ detail: "Not authorized to message on this ticket" }, { status: 403 });
    }

    // Insert message
    const result = await sql`
      INSERT INTO chat_messages (ticket_id, sender_id, message, created_at)
      VALUES (${id}, ${user.id}, ${message}, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    // Update ticket status
    const newStatus = user.role === "admin" ? "In Progress" : "Open";
    await sql`
      UPDATE support_tickets 
      SET status = ${newStatus}
      WHERE id = ${id}
    `;

    return NextResponse.json({
      ...result[0],
      sender_name: user.full_name,
      sender_role: user.role
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
