import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, specs: true },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/products (Admin only)
export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied. Administrative rights required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, slug, itemCode, type, categoryId, shortDesc, description, price, hsn, taxRate, stockQty, unit, specs, image } = body;

    const category = await prisma.category.findUnique({
      where: { slug: categoryId },
    });

    const dbCategoryId = category ? category.id : categoryId; // fallback

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        itemCode,
        type,
        categoryId: dbCategoryId,
        shortDesc,
        description,
        price,
        hsn,
        taxRate,
        stockQty,
        unit,
        image,
        specs: {
          create: specs.map((s: any) => ({
            label: s.label,
            value: s.value,
          })),
        },
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("API Create product error:", error);
    return NextResponse.json({ error: "Could not create the product. Check that the slug is unique." }, { status: 500 });
  }
}) as any;
