import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const role      = (session.user as any).role;
    const agentCode = (session.user as any).agentCode;
    if (role !== "AGENT") return NextResponse.json({ success: false }, { status: 403 });

    const students = await prisma.application.findMany({
      where: { agentCode },
      include: {
        student:    { select: { name: true, email: true, createdAt: true } },
        university: { select: { name: true } },
        program:    { select: { name: true, level: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
