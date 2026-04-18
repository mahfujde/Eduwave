import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/rbac";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const pages = await prisma.page.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const body = await req.json();
    const { title, slug, excerpt, sections, status, metaTitle, metaDesc, ogImage, sortOrder } = body;
    if (!title || !slug) return NextResponse.json({ success: false, message: "Title and slug are required." }, { status: 400 });

    const page = await prisma.page.create({
      data: { title, slug, excerpt, sections: sections ? JSON.stringify(sections) : null, status: status ?? "draft", isSystem: false, metaTitle, metaDesc, ogImage, sortOrder: sortOrder ?? 0 },
    });
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ success: false, message: "Slug already exists." }, { status: 409 });
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const body = await req.json();
    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(body.title     !== undefined && { title:     body.title }),
        ...(body.excerpt   !== undefined && { excerpt:   body.excerpt }),
        ...(body.sections  !== undefined && { sections:  typeof body.sections === "string" ? body.sections : JSON.stringify(body.sections) }),
        ...(body.status    !== undefined && { status:    body.status }),
        ...(body.metaTitle !== undefined && { metaTitle: body.metaTitle }),
        ...(body.metaDesc  !== undefined && { metaDesc:  body.metaDesc }),
        ...(body.ogImage   !== undefined && { ogImage:   body.ogImage }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    });
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !isAdmin((session.user as any).role)) return NextResponse.json({ success: false }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    const page = await prisma.page.findUnique({ where: { id } });
    if (page?.isSystem) return NextResponse.json({ success: false, message: "System pages cannot be deleted." }, { status: 403 });

    await prisma.page.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
