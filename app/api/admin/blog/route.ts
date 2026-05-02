import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, tags, author, isPublished, metaTitle, metaDesc } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: "Title and slug required" }, { status: 400 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content, coverImage, tags, author: author || "Eduwave Team",
        isPublished: isPublished ?? false,
        publishedAt: isPublished ? new Date() : null,
        metaTitle, metaDesc,
      },
    });
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const body = await req.json();
    if (body.isPublished && !body.publishedAt) {
      body.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
