import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Single page by slug
      const page = await prisma.page.findFirst({
        where: { slug, status: "published" },
      });
      if (!page) return NextResponse.json({ success: false, message: "Page not found" }, { status: 404 });
      return NextResponse.json({ success: true, data: page });
    }

    // All published pages
    const pages = await prisma.page.findMany({
      where: { status: "published" },
      select: { id: true, title: true, slug: true, excerpt: true, sortOrder: true, updatedAt: true },
      orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    });
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
