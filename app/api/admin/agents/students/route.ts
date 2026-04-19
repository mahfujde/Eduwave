import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

// GET /api/admin/agents/students?agentCode=AGT-XXXX
// Returns all students referred by a specific agent
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const agentCode = new URL(req.url).searchParams.get("agentCode");
    if (!agentCode) {
      return NextResponse.json({ success: false, message: "Agent code required" }, { status: 400 });
    }

    // Find all students who were referred by this agent code
    const students = await prisma.user.findMany({
      where: { referredBy: agentCode, role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        isActive: true,
        applications: {
          select: {
            id: true,
            trackingNumber: true,
            universityName: true,
            programName: true,
            status: true,
            intake: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
