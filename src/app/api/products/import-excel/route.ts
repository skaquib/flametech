import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

interface ExcelRow {
  "Item Code"?: string | number;
  "Item Name"?: string;
  HSN?: string | number;
  "Sale Price"?: number;
  "Online Store Price"?: number;
  "Current Stock Quantity"?: number;
  "Minimum Stock Quantity"?: number;
  "Tax Rate"?: string;
}

// POST /api/products/import-excel (Admin only) — bulk add/update products from a
// Vyapar-style inventory export (.xls/.xlsx). Matches existing catalog items by
// Item Name (this export has no Item Code), updates their stock/price/tax fields,
// and creates anything not already in the catalog.
export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "File is too large (max 10MB)." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: "buffer" });
    } catch {
      return NextResponse.json({ error: "Could not read this file. Make sure it's a valid .xls or .xlsx export." }, { status: 400 });
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: "" });

    if (rows.length === 0) {
      return NextResponse.json({ error: "The file has no rows to import." }, { status: 400 });
    }

    const sparePartsCategory = await prisma.category.upsert({
      where: { slug: "spare-parts" },
      update: {},
      create: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    });

    // Matched against every product regardless of deletedAt, so a name that
    // collides with a currently-trashed item's (still-unique) slug can't crash create().
    const existingProducts = await prisma.product.findMany({
      select: { id: true, name: true, slug: true },
    });
    const byName = new Map(existingProducts.map((p) => [p.name.trim().toLowerCase(), p]));
    const usedSlugs = new Set(existingProducts.map((p) => p.slug));

    function uniqueSlug(base: string): string {
      let s = base || "item";
      let n = 1;
      while (usedSlugs.has(s)) s = `${base}-${n++}`;
      usedSlugs.add(s);
      return s;
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const skippedSample: string[] = [];

    for (const row of rows) {
      const name = String(row["Item Name"] ?? "").trim();
      // Vyapar exports sometimes include stray date/section rows with no real item data.
      const isJunkRow = !name || /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(name);
      if (isJunkRow) {
        skipped++;
        continue;
      }

      const salePrice = Number(row["Sale Price"]) || 0;
      const onlinePrice = Number(row["Online Store Price"]) || 0;
      const price = onlinePrice > 0 ? onlinePrice : salePrice;
      const stockQty = Math.max(0, Math.round(Number(row["Current Stock Quantity"]) || 0));
      const minStockQty = Math.max(0, Math.round(Number(row["Minimum Stock Quantity"]) || 0));
      const itemCode = String(row["Item Code"] ?? "").trim() || null;
      const hsn = String(row["HSN"] ?? "").trim() || null;
      const taxRate = String(row["Tax Rate"] ?? "").trim() || null;

      const match = byName.get(name.toLowerCase());

      if (match) {
        const data: any = { stockQty, minStockQty };
        if (hsn) data.hsn = hsn;
        if (taxRate) data.taxRate = taxRate;
        if (itemCode) data.itemCode = itemCode;
        if (price > 0) data.price = price; // a blank/0 price in the sheet shouldn't wipe out a real price already on file
        await prisma.product.update({ where: { id: match.id }, data });
        updated++;
      } else {
        // Unpriced rows are internal stock/hardware in this export, not sellable
        // catalog items — same convention as the CLI Vyapar importer.
        if (price <= 0) {
          skipped++;
          if (skippedSample.length < 20) skippedSample.push(`${name} (no price)`);
          continue;
        }
        const slug = uniqueSlug(slugify(name));
        const newProduct = await prisma.product.create({
          data: {
            name,
            slug,
            itemCode,
            type: "PART",
            categoryId: sparePartsCategory.id,
            price,
            hsn,
            taxRate,
            stockQty,
            minStockQty,
            unit: "PIECES",
            isActive: true,
          },
        });
        byName.set(name.toLowerCase(), { id: newProduct.id, name, slug });
        created++;
      }
    }

    revalidateTag("products", { expire: 0 });
    return NextResponse.json({ totalRows: rows.length, created, updated, skipped, skippedSample });
  } catch (error: any) {
    console.error("Excel import error:", error);
    return NextResponse.json({ error: "Could not process the uploaded file." }, { status: 500 });
  }
}) as any;
