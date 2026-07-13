import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImageBuffer } from "@/lib/supabaseStorage";

// Vercel serverless functions reject request bodies over ~4.5MB at the platform
// level (a 413 before this code even runs) — keep the app-level check safely
// under that so a legible error can actually be returned instead.
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB per file

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
        return NextResponse.json({ error: `"${file.name}" is too large (max 4MB per image after compression).` }, { status: 400 });
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
