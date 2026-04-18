import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN","ADMIN","EDITOR"].includes((session.user as any)?.role)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true, name: true, email: true, role: true, phone: true,
        isApproved: true, isActive: true, agentCode: true, referredBy: true,
        createdAt: true, updatedAt: true,
        studentProfile: true,
        applications: {
          select: {
            id: true, trackingNumber: true, universityName: true, programName: true,
            intake: true, status: true, createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        agentApplication: {
          select: { id: true, status: true, region: true, experience: true, motivation: true, createdAt: true },
        },
      },
    });

    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("GET /api/admin/users/[id]:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
