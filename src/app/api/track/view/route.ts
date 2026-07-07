import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/track/view — fire-and-forget product view logging
export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required." }, { status: 400 });
    }

    const session = await auth();

    await prisma.productView.create({
      data: {
        productId,
        userId: session?.user?.id || null,
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error: any) {
    console.error("Product view tracking error:", error);
    return NextResponse.json({ error: "Could not record view." }, { status: 500 });
  }
}
