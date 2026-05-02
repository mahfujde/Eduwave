import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const items = await prisma.notification.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const body = await req.json();
    const data: any = {
      title: body.title,
      content: body.content,
      type: body.type || "info",
      style: body.style || "bar",
      position: body.position || "top",
      isActive: body.isActive ?? true,
      isDismissible: body.isDismissible ?? true,
      targetPages: body.targetPages || '["*"]',
      sortOrder: body.sortOrder ? parseInt(body.sortOrder) : 0,
      delay: body.delay ? parseInt(body.delay) : 0,
      linkText: body.linkText || null,
      linkUrl: body.linkUrl || null,
      videoUrl: body.videoUrl || null,
      imageUrl: body.imageUrl || null,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
    };
    const item = await prisma.notification.create({ data });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error("Notification POST error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });
    const body = await req.json();
    const updateData: any = {};
    // Only set fields that are explicitly provided
    if ("title" in body) updateData.title = body.title;
    if ("content" in body) updateData.content = body.content;
    if ("type" in body) updateData.type = body.type;
    if ("style" in body) updateData.style = body.style;
    if ("position" in body) updateData.position = body.position;
    if ("isActive" in body) updateData.isActive = body.isActive;
    if ("isDismissible" in body) updateData.isDismissible = body.isDismissible;
    if ("targetPages" in body) updateData.targetPages = body.targetPages;
    if ("sortOrder" in body) updateData.sortOrder = parseInt(body.sortOrder) || 0;
    if ("delay" in body) updateData.delay = parseInt(body.delay) || 0;
    if ("linkText" in body) updateData.linkText = body.linkText || null;
    if ("linkUrl" in body) updateData.linkUrl = body.linkUrl || null;
    if ("videoUrl" in body) updateData.videoUrl = body.videoUrl || null;
    if ("imageUrl" in body) updateData.imageUrl = body.imageUrl || null;
    if ("startDate" in body) updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    if ("endDate" in body) updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    const item = await prisma.notification.update({ where: { id }, data: updateData });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Notification PUT error:", error?.message || error);
    return NextResponse.json({ success: false, message: error?.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });
    await prisma.notification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
