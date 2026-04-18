import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

// GET all agent applications (pending/approved/rejected)
export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });

    const agentApps = await prisma.agentApplication.findMany({
      include: { user: { select: { id: true, name: true, email: true, agentCode: true, isApproved: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: agentApps });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PATCH — approve or reject an agent application
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const { action, reviewNotes } = await req.json();
    const agentApp = await prisma.agentApplication.findUnique({ where: { id } });
    if (!agentApp) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    if (action === "approve") {
      const agentCode = `AGT-${nanoid(8).toUpperCase()}`;
      const tempPassword = nanoid(10);
      const hashed = await bcrypt.hash(tempPassword, 12);

      // Create user account for agent
      const user = await prisma.user.upsert({
        where: { email: agentApp.email },
        update: { role: "AGENT", isApproved: true, agentCode },
        create: { email: agentApp.email, name: agentApp.name, password: hashed, role: "AGENT", isApproved: true, isActive: true, agentCode },
      });

      await prisma.agentApplication.update({
        where: { id },
        data: { status: "approved", userId: user.id, reviewNotes: reviewNotes || null },
      });

      return NextResponse.json({ success: true, message: `Agent approved. Code: ${agentCode}`, agentCode, tempPassword });
    }

    if (action === "reject") {
      await prisma.agentApplication.update({
        where: { id },
        data: { status: "rejected", reviewNotes: reviewNotes || null },
      });
      return NextResponse.json({ success: true, message: "Agent application rejected." });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
