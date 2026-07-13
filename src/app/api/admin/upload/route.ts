import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/supabaseStorage";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB per file — plenty for product photos, keeps requests small

export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const formData = await (req as unknown as NextRequest).formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const urls: string[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ error: `"${file.name}" is too large (max 8MB per image).` }, { status: 400 });
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
      const url = await uploadImageBuffer(buffer, file.type || "image/jpeg", extension);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    console.error("Admin image upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed. Please try again." }, { status: 500 });
  }
}) as any;
