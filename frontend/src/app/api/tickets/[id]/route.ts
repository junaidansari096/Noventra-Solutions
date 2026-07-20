import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const { id } = await params;
    const tickets = await sql`
      SELECT t.*, u.full_name as customer_name, u.email as customer_email
      FROM support_tickets t
      JOIN users u ON t.customer_id = u.id
      WHERE t.id = ${id}
      LIMIT 1
    `;

    if (tickets.length === 0) {
      return NextResponse.json({ detail: "Ticket not found" }, { status: 404 });
    }

    const ticket = tickets[0];

    // Restrict if not owner and not admin
    if (user.role !== "admin" && ticket.customer_id !== user.id) {
      return NextResponse.json({ detail: "Not authorized to view this ticket" }, { status: 403 });
    }

    // Fetch messages
    const messages = await sql`
      SELECT m.*, u.full_name as sender_name, u.role as sender_role
      FROM chat_messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.ticket_id = ${id}
      ORDER BY m.created_at ASC
    `;

    return NextResponse.json({
      ...ticket,
      messages
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
