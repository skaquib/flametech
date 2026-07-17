import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/products/bulk-delete (Admin only) — soft-deletes multiple products at once
export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const ids: string[] = Array.isArray(body?.ids) ? body.ids.filter(Boolean) : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "No product ids provided." }, { status: 400 });
    }

    const result = await prisma.product.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    revalidateTag("products", { expire: 0 });
    return NextResponse.json({ count: result.count });
  } catch (error: any) {
    console.error("Bulk delete products error:", error);
    return NextResponse.json({ error: "Could not delete the selected products." }, { status: 500 });
  }
}) as any;
