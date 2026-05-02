import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Ensure fresh data on every request
export const dynamic = "force-dynamic";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const body = await req.json();
    const testimonial = await prisma.testimonial.create({ data: body });
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const body = await req.json();
    const testimonial = await prisma.testimonial.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
