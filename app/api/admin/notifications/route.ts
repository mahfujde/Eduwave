import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

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
    const item = await prisma.notification.create({ data: { ...body, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
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
    const item = await prisma.notification.update({ where: { id }, data: { ...body, startDate: body.startDate ? new Date(body.startDate) : null, endDate: body.endDate ? new Date(body.endDate) : null } });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
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
