import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/quotes (Admin only)
export const GET = auth(async function GET(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { product: true },
    });
    return NextResponse.json(quotes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}) as any;

// POST /api/quotes (Public Lead ingestion)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, name, company, phone, email, message } = body;

  if (!productId || !name || !phone) {
    return NextResponse.json({ error: "productId, name, and phone are required." }, { status: 400 });
  }

  try {
    const session = await auth();

    const newQuote = await prisma.quoteRequest.create({
      data: {
        userId: session?.user?.id || null,
        productId,
        name,
        company,
        phone,
        email,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error: any) {
    console.error("Quote create API error:", error);
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }
}
