import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isStaff } from "@/lib/rbac";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const session = await auth();
    if (!session || !isStaff((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !isStaff((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const formData = await req.formData();
    const file     = formData.get("file") as File;
    const folder   = (formData.get("folder") as string) || "general";

    if (!file) return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitise filename
    const ext      = path.extname(file.name);
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${baseName}_${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const url      = `/uploads/${folder}/${fileName}`;
    const mimeType = file.type;
    const isImage  = mimeType.startsWith("image/");
    const isVideo  = mimeType.startsWith("video/");
    const type     = isImage ? "image" : isVideo ? "video" : "document";

    const record = await prisma.mediaFile.create({
      data: {
        name:       file.name,
        url,
        type,
        size:       file.size,
        mimeType,
        folder,
        uploadedBy: (session.user as any).id,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("Media upload error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !isStaff((session.user as any).role)) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false }, { status: 400 });

    await prisma.mediaFile.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
