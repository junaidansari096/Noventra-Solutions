import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/services/all -> Returns all services (admin only)
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const services = await sql`
      SELECT * FROM services 
      ORDER BY id ASC
    `;
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
