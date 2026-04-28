import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";
import bcrypt from "bcryptjs";

// FIX: GET /api/admin/users — supports ?role=STUDENT filter
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const where: any = {};
    if (role) where.role = role;
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, role: true, phone: true, isApproved: true, isActive: true, agentCode: true, referredBy: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/admin/users
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ success: false }, { status: 400 });
    if (data.password && data.password.trim() !== "") {
      data.password = await bcrypt.hash(data.password, 12);
    } else {
      delete data.password;
    }
    // Clean empty agentCode to null to prevent unique constraint violations
    if (data.agentCode !== undefined && (!data.agentCode || data.agentCode.trim() === "")) {
      data.agentCode = null;
    }
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, phone: true, isApproved: true, isActive: true, agentCode: true, referredBy: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/admin/users
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const body = await req.json();
    if (!body.email || !body.password) return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    body.password = await bcrypt.hash(body.password, 12);
    // Clean empty agentCode to null to prevent unique constraint violations
    if (!body.agentCode || body.agentCode.trim() === "") {
      body.agentCode = null;
    }
    // Clean empty optional fields
    if (!body.phone || body.phone.trim() === "") body.phone = null;
    if (!body.name || body.name.trim() === "") body.name = "";
    const user = await prisma.user.create({
      data: body,
      select: { id: true, email: true, name: true, role: true, phone: true, isApproved: true, isActive: true, agentCode: true, referredBy: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    console.error("Create user error:", error);
    if (error?.code === "P2002") {
      const field = error?.meta?.target?.[0] || "email";
      return NextResponse.json({ success: false, message: `A user with this ${field} already exists` }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// FIX: DELETE /api/admin/users — cascade delete all related records first
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });

    // FIX: Prevent deleting yourself
    if (id === (session.user as any).id) {
      return NextResponse.json({ success: false, message: "Cannot delete your own account" }, { status: 400 });
    }

    // FIX: Manual cascade — delete all child records before deleting user
    // 1. Delete messages sent by this user
    await prisma.applicationMessage.deleteMany({ where: { senderId: id } });

    // 2. Delete documents on applications by this user (student)
    const studentApps = await prisma.application.findMany({
      where: { studentId: id },
      select: { id: true },
    });
    if (studentApps.length > 0) {
      const appIds = studentApps.map(a => a.id);
      await prisma.applicationDocument.deleteMany({ where: { applicationId: { in: appIds } } });
      await prisma.applicationMessage.deleteMany({ where: { applicationId: { in: appIds } } });
    }

    // 3. Delete applications where user is student
    await prisma.application.deleteMany({ where: { studentId: id } });

    // 4. Nullify agent references on applications where user is agent
    await prisma.application.updateMany({
      where: { agentId: id },
      data: { agentId: null, agentCode: null },
    });

    // 5. Delete student profile
    await prisma.studentProfile.deleteMany({ where: { userId: id } });

    // 6. Delete agent application
    await prisma.agentApplication.deleteMany({ where: { userId: id } });

    // 7. Finally delete the user
    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "User and all related data deleted" });
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to delete user" }, { status: 500 });
  }
}
