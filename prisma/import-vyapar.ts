import { PrismaClient, ProductType } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80);
}

type VyaparRow = {
  "Item Code": string;
  "Item Name": string;
  HSN: string;
  "Sale Price": number;
  "Current Stock Quantity": number;
  "Minimum Stock Quantity": number;
  "Tax Rate": string;
};

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Usage: npx tsx prisma/import-vyapar.ts <path-to-vyapar-export.xls>");
    process.exit(1);
  }

  console.log(`Reading Vyapar export from ${filePath} ...`);
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<VyaparRow>(sheet, { defval: "" });

  // Only rows with a real sale price are treated as sellable catalog items.
  // Rows at ₹0 are unpriced internal stock (fittings, hardware) and are skipped.
  const priced = rows.filter((r) => Number(r["Sale Price"]) > 0);
  console.log(`${rows.length} rows total, ${priced.length} have a sale price and will be imported.`);

  const sparePartsCategory = await prisma.category.upsert({
    where: { slug: "spare-parts" },
    update: {},
    create: { name: "Spare Parts & Accessories", slug: "spare-parts" },
  });

  const existing = await prisma.product.findMany({ select: { slug: true } });
  const usedSlugs = new Set(existing.map((p) => p.slug));

  function uniqueSlug(base: string): string {
    let s = base;
    let n = 1;
    while (usedSlugs.has(s)) {
      s = `${base}-${n++}`;
    }
    usedSlugs.add(s);
    return s;
  }

  let created = 0;
  let updated = 0;

  for (const row of priced) {
    const name = String(row["Item Name"]).trim();
    if (!name) continue;

    const slug = slugify(name);
    const price = Math.round(Number(row["Sale Price"]));
    const stockQty = Math.max(0, Math.round(Number(row["Current Stock Quantity"]) || 0));
    const minStockQty = Math.max(0, Math.round(Number(row["Minimum Stock Quantity"]) || 0));
    const itemCode = String(row["Item Code"]).trim() || null;
    const hsn = String(row["HSN"]).trim() || null;
    const taxRate = String(row["Tax Rate"]).trim() || null;

    const existingProduct = await prisma.product.findUnique({ where: { slug } });

    if (existingProduct) {
      await prisma.product.update({
        where: { slug },
        data: { price, stockQty, minStockQty, hsn, taxRate, itemCode },
      });
      updated++;
    } else {
      await prisma.product.create({
        data: {
          name,
          slug: uniqueSlug(slug),
          itemCode,
          type: ProductType.PART,
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
      created++;
    }
  }

  console.log("\n============================");
  console.log("Vyapar import completed!");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log("============================\n");
}

main()
  .catch((e) => {
    console.error("Import error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
