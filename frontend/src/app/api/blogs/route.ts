import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// GET /api/blogs/ -> Returns all blogs (public) sorted by published_at DESC
export async function GET() {
  try {
    const blogs = await sql`
      SELECT * FROM blogs 
      ORDER BY published_at DESC
    `;
    return NextResponse.json(blogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/blogs/ -> Creates a blog (admin only)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ detail: "Not authorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, summary, cover_image, author_name, tags } = body;

    const result = await sql`
      INSERT INTO blogs (title, content, summary, cover_image, author_name, tags, published_at)
      VALUES (${title}, ${content}, ${summary}, ${cover_image}, ${author_name ?? "Noventra Team"}, ${JSON.stringify(tags)}, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
