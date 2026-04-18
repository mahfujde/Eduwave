import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, isApproved: true, isActive: true, agentCode: true, createdAt: true, phone: true },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });

    const body = await req.json();
    const { name, email, password, role, isApproved, agentCode } = body;
    if (!email || !password) return NextResponse.json({ success: false, message: "Email and password required." }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name || "", email, password: hashed, role: role || "STUDENT", isApproved: isApproved ?? true, isActive: true, agentCode: agentCode || null },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ success: false, message: "Email already exists." }, { status: 409 });
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
    const updateData: any = {};
    if (body.name       !== undefined) updateData.name       = body.name;
    if (body.role       !== undefined) updateData.role       = body.role;
    if (body.isApproved !== undefined) updateData.isApproved = body.isApproved;
    if (body.isActive   !== undefined) updateData.isActive   = body.isActive;
    if (body.agentCode  !== undefined) updateData.agentCode  = body.agentCode || null;
    if (body.phone      !== undefined) updateData.phone      = body.phone;
    if (body.password) updateData.password = await bcrypt.hash(body.password, 12);

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, isApproved: true, isActive: true, agentCode: true },
    });
    return NextResponse.json({ success: true, data: updated });
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

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
