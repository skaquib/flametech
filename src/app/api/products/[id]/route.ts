import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] (Fetch single product details)
export async function GET(req: NextRequest, context: any) {
  const { id } = await (context.params as { id: string });
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { specs: true, category: true, images: { orderBy: { position: "asc" } } },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/products/[id] (Full details update or toggle active state, Admin only)
export const PATCH = auth(async function PATCH(req, context: any) {
  const { id } = await (context.params as { id: string });
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, slug, itemCode, type, categoryId, shortDesc, description, price, hsn, taxRate, stockQty, unit, specs, isActive, image, images } = body;

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug;
    if (itemCode !== undefined) updateData.itemCode = itemCode;
    if (type !== undefined) updateData.type = type;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (hsn !== undefined) updateData.hsn = hsn;
    if (taxRate !== undefined) updateData.taxRate = taxRate;
    if (stockQty !== undefined) updateData.stockQty = stockQty;
    if (unit !== undefined) updateData.unit = unit;

    // `images` (gallery) is the source of truth when provided; the legacy single
    // `image` field is kept in sync to the cover (first) image for older callers.
    if (images !== undefined) {
      const galleryUrls: string[] = Array.isArray(images) ? images.filter(Boolean) : [];
      updateData.image = galleryUrls[0] ?? null;
      updateData.images = {
        deleteMany: {},
        create: galleryUrls.map((url: string, position: number) => ({ url, position })),
      };
    } else if (image !== undefined) {
      updateData.image = image;
    }

    if (categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { slug: categoryId },
      });
      updateData.categoryId = category ? category.id : categoryId;
    }

    if (specs !== undefined) {
      updateData.specs = {
        deleteMany: {},
        create: specs.map((s: any) => ({
          label: s.label,
          value: s.value,
        })),
      };
    }

    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidateTag("products", { expire: 0 });
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH product update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    revalidateTag("products", { expire: 0 });
    return NextResponse.json(deleted);
  } catch (error: any) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ error: "Could not delete this product." }, { status: 500 });
  }
}) as any;
