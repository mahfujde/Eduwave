import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return null;
}

// GET /api/admin/universities — list ALL universities (including hidden)
export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const universities = await prisma.university.findMany({
      include: { _count: { select: { programs: true } } },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: universities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// POST /api/admin/universities — create a university
export async function POST(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const body = await req.json();
    const { name, slug, shortName, description, country, city, address, website, email, phone, logo, banner, ranking, established, type, offerLetter, featured, isPublic, sortOrder, metaTitle, metaDesc } = body;

    if (!name || !slug) {
      return NextResponse.json({ success: false, message: "Name and slug are required" }, { status: 400 });
    }

    const existing = await prisma.university.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
    }

    const university = await prisma.university.create({
      data: {
        name, slug, shortName, description, country: country || "Malaysia", city, address, website, email, phone, logo, banner, ranking, established, type, offerLetter: offerLetter ?? true, featured: featured ?? false, isPublic: isPublic ?? true, sortOrder: sortOrder ?? 0, metaTitle, metaDesc,
      },
    });

    return NextResponse.json({ success: true, data: university }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// PUT /api/admin/universities?id=xxx — update a university
export async function PUT(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    const body = await req.json();
    // Strip read-only / non-updatable fields
    const { id: _id, createdAt, updatedAt, _count, programs, applications, ...data } = body;
    const university = await prisma.university.update({ where: { id }, data });

    return NextResponse.json({ success: true, data: university });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/universities?id=xxx
export async function DELETE(req: NextRequest) {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "ID required" }, { status: 400 });

    await prisma.university.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
