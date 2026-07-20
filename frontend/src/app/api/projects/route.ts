import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/projects/ -> Returns all projects (public)
export async function GET() {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY id ASC
    `;
    return NextResponse.json(projects);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/projects/ -> Creates a project (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, client_name, description, image_url, preview_url, tech_stack, category, featured } = body;

    const result = await sql`
      INSERT INTO projects (title, client_name, description, image_url, preview_url, tech_stack, category, featured)
      VALUES (${title}, ${client_name}, ${description}, ${image_url}, ${preview_url}, ${JSON.stringify(tech_stack)}, ${category}, ${featured ?? false})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
