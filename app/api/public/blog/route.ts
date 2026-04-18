import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/public/blog — list published blog posts or get by slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post || !post.isPublished) {
        return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: post });
    }

    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error("Blog API error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
