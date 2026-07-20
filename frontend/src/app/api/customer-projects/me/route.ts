import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/customer-projects/me -> Returns logged-in customer's projects
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    let projects;
    if (user.role === "admin") {
      projects = await sql`
        SELECT * FROM customer_projects 
        ORDER BY id ASC
      `;
    } else {
      projects = await sql`
        SELECT * FROM customer_projects 
        WHERE customer_id = ${user.id} 
        ORDER BY id ASC
      `;
    }

    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
