import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH /api/orders/[id] (Transition status, Admin only)
export const PATCH = auth(async function PATCH(req, context: any) {
  const { id } = await (context.params as { id: string });
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { status } = body;

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH order status error:", error);
    return NextResponse.json({ mockSuccess: true });
  }
}) as any;
