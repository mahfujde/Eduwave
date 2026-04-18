import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isStaff } from "@/lib/rbac";

// GET — messages for an application, or messages center (all conversations)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    if (applicationId) {
      // Verify ownership (students) or staff access
      if (!isStaff(role)) {
        const app = await prisma.application.findFirst({
          where: { id: applicationId, studentId: userId },
        });
        if (!app) return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
      }

      const messages = await prisma.applicationMessage.findMany({
        where: { applicationId },
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { name: true, role: true, avatar: true } } },
      });

      // Mark messages as read for the current user's perspective
      const oppositeRole = isStaff(role) ? "STUDENT" : { not: "STUDENT" };
      await prisma.applicationMessage.updateMany({
        where: {
          applicationId,
          senderRole: typeof oppositeRole === "string" ? oppositeRole : oppositeRole,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true, data: messages });
    }

    // Messages center — list all conversations with unread counts
    const whereClause = isStaff(role) ? {} : { studentId: userId };
    const applications = await prisma.application.findMany({
      where: whereClause,
      select: {
        id: true,
        trackingNumber: true,
        universityName: true,
        programName: true,
        status: true,
        university: { select: { name: true } },
        program: { select: { name: true } },
        student: { select: { name: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          include: { sender: { select: { name: true, role: true } } },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Filter to only apps with messages
    const withMessages = applications.filter((a) => a._count.messages > 0);

    return NextResponse.json({ success: true, data: withMessages });
  } catch (error) {
    console.error("GET /api/student/messages:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// POST — send a message
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role = (session.user as any).role;
    const { applicationId, message } = await req.json();

    if (!applicationId || !message?.trim()) {
      return NextResponse.json({ success: false, message: "applicationId and message are required" }, { status: 400 });
    }

    // Verify ownership (students) or staff access
    if (!isStaff(role)) {
      const app = await prisma.application.findFirst({
        where: { id: applicationId, studentId: userId },
      });
      if (!app) return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    const msg = await prisma.applicationMessage.create({
      data: {
        applicationId,
        senderId: userId,
        senderRole: role === "STUDENT" ? "STUDENT" : "ADMIN",
        message: message.trim(),
      },
      include: { sender: { select: { name: true, role: true, avatar: true } } },
    });

    return NextResponse.json({ success: true, data: msg }, { status: 201 });
  } catch (error) {
    console.error("POST /api/student/messages:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
