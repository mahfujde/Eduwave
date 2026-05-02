import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

// GET — admin fetches dashboard notifications
export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const notifications = await prisma.adminNotification.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.adminNotification.count({ where: { isRead: false } });

    return NextResponse.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PATCH — mark notification(s) as read
export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id === "all") {
      await prisma.adminNotification.updateMany({ data: { isRead: true } });
    } else if (id) {
      await prisma.adminNotification.update({ where: { id }, data: { isRead: true } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
