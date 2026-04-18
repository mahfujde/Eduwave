import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "/";
    const now  = new Date();

    const notifications = await prisma.notification.findMany({
      where: {
        isActive: true,
        OR: [{ startDate: null }, { startDate: { lte: now } }],
        AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
      },
      orderBy: [{ sortOrder: "asc" }],
    });

    // Filter by target pages
    const filtered = notifications.filter(n => {
      if (!n.targetPages) return true;
      try {
        const targets: string[] = JSON.parse(n.targetPages);
        return targets.includes("*") || targets.includes(page);
      } catch {
        return true;
      }
    });

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] });
  }
}
