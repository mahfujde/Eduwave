import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET — single application
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role   = (session.user as any).role;

    const app = await prisma.application.findUnique({
      where: { id: params.id },
      include: {
        university: { select: { id: true, name: true, logo: true, city: true } },
        program:    { select: { id: true, name: true, level: true, duration: true } },
        documents:  { orderBy: { createdAt: "asc" } },
        messages:   { orderBy: { createdAt: "asc" }, include: { sender: { select: { name: true, role: true, avatar: true } } } },
        student:    { select: { name: true, email: true, phone: true } },
      },
    });

    if (!app) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });

    // Students can only see their own applications
    if (role === "STUDENT" && app.studentId !== userId) {
      return NextResponse.json({ success: false }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: app });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

// PATCH — student sends a message or uploads doc; admin updates status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const role   = (session.user as any).role;
    const body   = await req.json();

    const app = await prisma.application.findUnique({ where: { id: params.id } });
    if (!app) return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    if (role === "STUDENT" && app.studentId !== userId) return NextResponse.json({ success: false }, { status: 403 });

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(body.status     && { status: body.status }),
        ...(body.adminNotes !== undefined && { adminNotes: body.adminNotes }),
        ...(body.intake     && { intake: body.intake }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
