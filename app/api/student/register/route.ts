import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, agentCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "Name, email, and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ success: false, message: "An account with this email already exists." }, { status: 409 });
    }

    // Validate agent code if provided
    let agentId: string | null = null;
    if (agentCode) {
      const agent = await prisma.user.findUnique({ where: { agentCode } });
      if (agent && agent.role === "AGENT" && agent.isApproved) {
        agentId = agent.id;
      }
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role: "STUDENT",
        isApproved: true, // students auto-approved
        isActive: true,
        referredBy: agentCode || null,
      },
    });

    // Create empty student profile
    await prisma.studentProfile.create({ data: { userId: user.id } });

    return NextResponse.json({ success: true, message: "Account created successfully! Please log in." }, { status: 201 });
  } catch (error) {
    console.error("Student register error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
