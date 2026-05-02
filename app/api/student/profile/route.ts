import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

// Whitelist of fields students can update
const ALLOWED_FIELDS = [
  "dateOfBirth", "nationality", "passportNo", "passportExpiry",
  "address", "emergencyContact", "lastQualification",
  "lastInstitution", "gpa", "englishScore",
];

export async function GET() {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;

    const profile = await prisma.studentProfile.findUnique({ where: { userId } });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false }, { status: 401 });
    const userId = (session.user as any).id;
    const body = await req.json();

    // Only allow whitelisted fields — prevents mass assignment attacks
    const sanitized: Record<string, any> = {};
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        // Basic sanitization: trim strings, ensure proper types
        const value = body[field];
        sanitized[field] = typeof value === "string" ? value.trim() : value;
      }
    }

    const profile = await prisma.studentProfile.upsert({
      where: { userId },
      update: sanitized,
      create: { userId, ...sanitized },
    });
    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    console.error("PUT /api/student/profile:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
