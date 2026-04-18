import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/admin/notifications/user-message
// Sends a targeted notification to a specific user's application messages or a new system notification
export async function POST(req: Request) {
  const session = await auth();
  if (!session || !["SUPER_ADMIN","ADMIN"].includes((session.user as any)?.role)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, message, userName } = await req.json();
    if (!userId || !message?.trim()) {
      return NextResponse.json({ success: false, message: "userId and message are required" }, { status: 400 });
    }

    const senderId = (session.user as any)?.id;
    if (!senderId) return NextResponse.json({ success: false, message: "Session error" }, { status: 401 });

    // Find the user's most recent application to attach message to
    const latestApp = await prisma.application.findFirst({
      where: { studentId: userId },
      orderBy: { createdAt: "desc" },
    });

    if (latestApp && senderId) {
      // Post as an application message so student sees it in portal
      await prisma.applicationMessage.create({
        data: {
          applicationId: latestApp.id,
          senderId: senderId,
          senderRole: "admin",
          message: `📢 Admin Message: ${message}`,
        },
      });
      return NextResponse.json({ success: true, message: "Message sent via application thread" });
    }

    // Fallback: create a global notification (visible to all)
    await prisma.notification.create({
      data: {
        type: "info",
        style: "bar",
        title: `Message for ${userName ?? "Student"}`,
        content: message,
        isActive: false,
        isDismissible: true,
      },
    });

    return NextResponse.json({ success: true, message: "Message recorded as notification" });
  } catch (error) {
    console.error("POST user-message:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
