import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

// GET — agent profile data
export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (role !== "AGENT") return NextResponse.json({ success: false, message: "Agents only" }, { status: 403 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, phone: true, agentCode: true, avatar: true, createdAt: true,
      },
    });

    // Get stats
    const [totalReferrals, enrolledCount, activeCount] = await Promise.all([
      prisma.application.count({ where: { agentCode: user?.agentCode ?? "" } }),
      prisma.application.count({ where: { agentCode: user?.agentCode ?? "", status: "enrolled" } }),
      prisma.application.count({
        where: {
          agentCode: user?.agentCode ?? "",
          status: { notIn: ["enrolled", "rejected", "withdrawn"] },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { ...user, stats: { totalReferrals, enrolledCount, activeCount } },
    });
  } catch (error) {
    console.error("GET /api/agent/profile:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PUT — update agent profile or change password
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    if (role !== "AGENT") return NextResponse.json({ success: false, message: "Agents only" }, { status: 403 });

    const body = await req.json();

    // Handle password change
    if (body.currentPassword && body.newPassword) {
      if (body.newPassword.length < 8) {
        return NextResponse.json({ success: false, message: "New password must be at least 8 characters" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

      const isValid = await bcrypt.compare(body.currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 400 });
      }

      const hashed = await bcrypt.hash(body.newPassword, 12);
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
      return NextResponse.json({ success: true, message: "Password changed successfully" });
    }

    // Handle profile update (only allow safe fields)
    const allowedFields: Record<string, any> = {};
    if (body.phone !== undefined) allowedFields.phone = body.phone;

    if (Object.keys(allowedFields).length > 0) {
      await prisma.user.update({ where: { id: userId }, data: allowedFields });
    }

    return NextResponse.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error("PUT /api/agent/profile:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
