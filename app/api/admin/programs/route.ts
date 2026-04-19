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

export async function GET() {
  const denied = await checkAuth();
  if (denied) return denied;

  try {
    const programs = await prisma.program.findMany({
      include: { university: { select: { id: true, name: true, slug: true } } },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: programs });
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
    const {
      name, slug, universityId, level, duration, language, intake, mode,
      description, overview, curriculum, requirements, careerProspects, fees,
      scholarships, englishReq, classType, qualification,
      featured, isPublic, sortOrder, metaTitle, metaDesc,
    } = body;

    if (!name || !slug || !universityId) {
      return NextResponse.json({ success: false, message: "Name, slug, and university are required" }, { status: 400 });
    }

    const existing = await prisma.program.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 });
    }

    const program = await prisma.program.create({
      data: {
        name, slug, universityId,
        level: level || "Bachelor",
        duration, language, intake, mode,
        description, overview,
        curriculum: curriculum ? (typeof curriculum === "string" ? curriculum : JSON.stringify(curriculum)) : null,
        requirements,
        careerProspects: careerProspects ? (typeof careerProspects === "string" ? careerProspects : JSON.stringify(careerProspects)) : null,
        fees: fees ? (typeof fees === "string" ? fees : JSON.stringify(fees)) : null,
        scholarships,
        englishReq, classType, qualification,
        featured: featured ?? false, isPublic: isPublic ?? true,
        sortOrder: sortOrder ?? 0, metaTitle, metaDesc,
      },
    });

    return NextResponse.json({ success: true, data: program }, { status: 201 });
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

    const raw = await req.json();
    // Strip read-only / non-updatable fields
    const { id: _id, createdAt, updatedAt, _count, university, applications, ...body } = raw;
    // Stringify JSON fields if they're objects
    if (body.fees && typeof body.fees !== "string") body.fees = JSON.stringify(body.fees);
    if (body.curriculum && typeof body.curriculum !== "string") body.curriculum = JSON.stringify(body.curriculum);
    if (body.careerProspects && typeof body.careerProspects !== "string") body.careerProspects = JSON.stringify(body.careerProspects);

    const program = await prisma.program.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: program });
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

    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
