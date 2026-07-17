import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// GET /api/products/trash (Admin only) — lists soft-deleted products, purging anything past the 7-day undo window first
export const GET = auth(async function GET(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const cutoff = new Date(Date.now() - SEVEN_DAYS_MS);
    await prisma.product.deleteMany({ where: { deletedAt: { lt: cutoff } } });

    const trashed = await prisma.product.findMany({
      where: { deletedAt: { not: null } },
      orderBy: { deletedAt: "desc" },
    });

    return NextResponse.json(trashed);
  } catch (error: any) {
    console.error("Trash list error:", error);
    return NextResponse.json({ error: "Could not load recently deleted products." }, { status: 500 });
  }
}) as any;

// POST /api/products/trash (Admin only) — restores soft-deleted products by id
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
      where: { id: { in: ids }, deletedAt: { not: null } },
      data: { deletedAt: null },
    });

    revalidateTag("products", { expire: 0 });
    return NextResponse.json({ count: result.count });
  } catch (error: any) {
    console.error("Restore products error:", error);
    return NextResponse.json({ error: "Could not restore the selected products." }, { status: 500 });
  }
}) as any;
