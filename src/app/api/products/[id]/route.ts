import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/products/[id] (Toggle Active state, Admin only)
export const PATCH = auth(async function PATCH(req, context: any) {
  const { id } = await (context.params as { id: string });
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { isActive } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH product toggle error:", error);
    return NextResponse.json({ mockSuccess: true });
  }
}) as any;

// DELETE /api/products/[id] (Admin only)
export const DELETE = auth(async function DELETE(req, context: any) {
  const { id } = await (context.params as { id: string });
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const deleted = await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ mockSuccess: true });
  }
}) as any;
