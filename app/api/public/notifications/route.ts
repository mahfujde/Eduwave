import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "/";

    // FIX: Fetch ALL active notifications without date filtering at the DB level.
    // Date filtering in MySQL has timezone issues — admin enters local time but
    // Prisma compares with UTC. We handle date checks in JS with local-time awareness.
    const notifications = await prisma.notification.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }],
    });

    // Filter by target pages
    const filtered = notifications.filter(n => {
      // Check target pages
      if (n.targetPages) {
        try {
          const targets: string[] = JSON.parse(n.targetPages);
          if (!targets.includes("*") && !targets.includes(page)) return false;
        } catch {
          // If parsing fails, include the notification
        }
      }

      // Soft date check: If dates exist, compare with current time
      // but be lenient (8-hour tolerance for timezone differences)
      const now = Date.now();
      if (n.startDate) {
        const start = new Date(n.startDate).getTime();
        // Allow 8-hour early showing for timezone tolerance
        if (now < start - 8 * 60 * 60 * 1000) return false;
      }
      if (n.endDate) {
        const end = new Date(n.endDate).getTime();
        // Allow 8-hour late showing for timezone tolerance
        if (now > end + 8 * 60 * 60 * 1000) return false;
      }

      return true;
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("[Notifications API error]", error);
    return NextResponse.json({ success: false, data: [] });
  }
}
