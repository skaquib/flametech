import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
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
    const { name, slug, itemCode, type, categoryId, shortDesc, description, price, hsn, taxRate, stockQty, unit, specs, image, images } = body;

    const category = await prisma.category.findUnique({
      where: { slug: categoryId },
    });

    const dbCategoryId = category ? category.id : categoryId; // fallback

    // `images` (gallery) is the source of truth when provided; the legacy single
    // `image` field is kept in sync to the cover (first) image for older callers.
    const galleryUrls: string[] = Array.isArray(images) ? images.filter(Boolean) : [];
    const coverImage = galleryUrls[0] ?? image ?? null;

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
        image: coverImage,
        specs: {
          create: specs.map((s: any) => ({
            label: s.label,
            value: s.value,
          })),
        },
        images: {
          create: galleryUrls.map((url: string, position: number) => ({ url, position })),
        },
      },
    });

    revalidateTag("products", { expire: 0 });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.error("API Create product error:", error);
    return NextResponse.json({ error: "Could not create the product. Check that the slug is unique." }, { status: 500 });
  }
}) as any;
