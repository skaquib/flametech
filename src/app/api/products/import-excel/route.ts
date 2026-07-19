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

// Column headers vary between Vyapar export versions/settings (e.g. "Item Name" vs
// "Item name*", "Sale Price" vs "Sale price") — matching on the exact string was the
// root cause of every row silently reading as blank and getting skipped. Instead,
// resolve each logical field to whatever the file's real header turns out to be,
// normalizing case/asterisks/whitespace and trying a few common alias spellings.
function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .replace(/[*_]/g, "")
    .replace(/[()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const FIELD_ALIASES: Record<string, string[]> = {
  itemName: ["item name", "name", "item"],
  itemCode: ["item code", "code", "sku", "item sku"],
  hsn: ["hsn", "hsn code", "hsn/sac"],
  salePrice: ["sale price", "price", "selling price"],
  onlineStorePrice: ["online store price", "online price", "web price"],
  currentStock: ["current stock quantity", "current stock", "stock quantity", "stock", "closing stock", "closing stock quantity"],
  minStock: ["minimum stock quantity", "min stock quantity", "minimum stock", "min stock"],
  taxRate: ["tax rate", "gst rate", "gst"],
};

function resolveColumns(headerKeys: string[]): Record<keyof typeof FIELD_ALIASES, string | undefined> {
  const normalizedToActual = new Map<string, string>();
  for (const key of headerKeys) {
    if (!normalizedToActual.has(normalizeHeader(key))) normalizedToActual.set(normalizeHeader(key), key);
  }

  const resolved = {} as Record<keyof typeof FIELD_ALIASES, string | undefined>;
  for (const field of Object.keys(FIELD_ALIASES) as (keyof typeof FIELD_ALIASES)[]) {
    resolved[field] = undefined;
    for (const alias of FIELD_ALIASES[field]) {
      const actual = normalizedToActual.get(alias);
      if (actual !== undefined) {
        resolved[field] = actual;
        break;
      }
    }
  }
  return resolved;
}

// POST /api/products/import-excel (Admin only) — bulk add/update products from a
// Vyapar-style inventory export (.xls/.xlsx). Streams one NDJSON line per row as it's
// processed so the admin UI can show live progress instead of a single blocking
// request, then a final "done" line with the summary. Matches existing catalog items
// by Item Name (this export has no Item Code), updates their stock/price/tax fields,
// and creates anything not already in the catalog.
//
// Each row is processed in its own try/catch: one bad row (an unexpected DB error,
// a slug collision that somehow slips past uniqueSlug, etc.) is reported as a
// "failed" row with the real error message and the import continues — it must never
// take down the whole stream, since that would silently discard everyone's progress
// for the sake of one row.
export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return Response.json({ error: "Access denied." }, { status: 403 });
  }

  const formData = await (req as any).formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return Response.json({ error: "File is too large (max 10MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  let workbook;
  try {
    workbook = XLSX.read(buffer, { type: "buffer" });
  } catch {
    return Response.json({ error: "Could not read this file. Make sure it's a valid .xls or .xlsx export." }, { status: 400 });
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, { defval: "" });

  if (rows.length === 0) {
    return Response.json({ error: "The file has no rows to import." }, { status: 400 });
  }

  const headerKeys = Object.keys(rows[0]);
  const columns = resolveColumns(headerKeys);

  if (!columns.itemName) {
    return Response.json(
      {
        error: `Could not find an item name column in this file. Found columns: ${headerKeys.join(", ")}. Expected something like "Item Name".`,
      },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: any) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

      try {
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
        // Names already handled earlier in THIS file — separate from byName, which also
        // includes products that already existed before the import started.
        const seenInThisFile = new Set<string>();

        function uniqueSlug(base: string): string {
          let s = base || "item";
          let n = 1;
          while (usedSlugs.has(s)) s = `${base}-${n++}`;
          usedSlugs.add(s);
          return s;
        }

        let created = 0;
        let updated = 0;
        let duplicates = 0;
        let skipped = 0;
        let failed = 0;
        const createdSample: string[] = [];
        const updatedSample: string[] = [];
        const duplicateSample: string[] = [];
        const skippedSample: string[] = [];
        const failedSample: string[] = [];
        const SAMPLE_LIMIT = 50;

        send({ type: "start", total: rows.length, matchedColumns: columns });

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          const name = String(row[columns.itemName!] ?? "").trim();
          const nameKey = name.toLowerCase();

          try {
            // Vyapar exports sometimes include stray date/section rows with no real item data.
            const isJunkRow = !name || /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(name);
            if (isJunkRow) {
              skipped++;
              const reason = "not a real item row";
              if (name && skippedSample.length < SAMPLE_LIMIT) skippedSample.push(`${name} (${reason})`);
              send({ type: "row", index: i + 1, total: rows.length, name: name || "(blank row)", action: "skipped", reason });
              continue;
            }

            // Same item name already handled earlier in this same file — report it
            // plainly as a duplicate instead of silently re-processing (or worse,
            // creating a second product with the same name under a "-1" slug).
            if (seenInThisFile.has(nameKey)) {
              duplicates++;
              const reason = "duplicate item name — already processed earlier in this file";
              if (duplicateSample.length < SAMPLE_LIMIT) duplicateSample.push(name);
              send({ type: "row", index: i + 1, total: rows.length, name, action: "duplicate", reason });
              continue;
            }
            seenInThisFile.add(nameKey);

            const salePrice = columns.salePrice ? Number(row[columns.salePrice]) || 0 : 0;
            const onlinePrice = columns.onlineStorePrice ? Number(row[columns.onlineStorePrice]) || 0 : 0;
            const price = onlinePrice > 0 ? onlinePrice : salePrice;
            const stockQty = columns.currentStock ? Math.max(0, Math.round(Number(row[columns.currentStock]) || 0)) : 0;
            const minStockQty = columns.minStock ? Math.max(0, Math.round(Number(row[columns.minStock]) || 0)) : 0;
            const itemCode = columns.itemCode ? String(row[columns.itemCode] ?? "").trim() || null : null;
            const hsn = columns.hsn ? String(row[columns.hsn] ?? "").trim() || null : null;
            const taxRate = columns.taxRate ? String(row[columns.taxRate] ?? "").trim() || null : null;

            const match = byName.get(nameKey);

            if (match) {
              const data: any = { stockQty, minStockQty };
              if (hsn) data.hsn = hsn;
              if (taxRate) data.taxRate = taxRate;
              if (itemCode) data.itemCode = itemCode;
              if (price > 0) data.price = price; // a blank/0 price in the sheet shouldn't wipe out a real price already on file
              await prisma.product.update({ where: { id: match.id }, data });
              updated++;
              if (updatedSample.length < SAMPLE_LIMIT) updatedSample.push(name);
              send({ type: "row", index: i + 1, total: rows.length, name, action: "updated" });
            } else if (price <= 0) {
              // Unpriced rows are internal stock/hardware in this export, not sellable
              // catalog items — same convention as the CLI Vyapar importer.
              skipped++;
              const reason = "no price";
              if (skippedSample.length < SAMPLE_LIMIT) skippedSample.push(`${name} (${reason})`);
              send({ type: "row", index: i + 1, total: rows.length, name, action: "skipped", reason });
            } else {
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
              byName.set(nameKey, { id: newProduct.id, name, slug });
              created++;
              if (createdSample.length < SAMPLE_LIMIT) createdSample.push(name);
              send({ type: "row", index: i + 1, total: rows.length, name, action: "created" });
            }
          } catch (rowError: any) {
            // A single bad row (e.g. an unexpected DB error) must not take down every
            // other row's progress — report it plainly and move on.
            console.error(`Excel import row ${i + 1} ("${name}") failed:`, rowError);
            failed++;
            const reason = rowError?.message || "unexpected error";
            if (failedSample.length < SAMPLE_LIMIT) failedSample.push(`${name || "(blank row)"} (${reason})`);
            send({ type: "row", index: i + 1, total: rows.length, name: name || "(blank row)", action: "failed", reason });
          }
        }

        revalidateTag("products", { expire: 0 });
        send({
          type: "done",
          totalRows: rows.length,
          created,
          updated,
          duplicates,
          skipped,
          failed,
          createdSample,
          updatedSample,
          duplicateSample,
          skippedSample,
          failedSample,
        });
      } catch (error: any) {
        console.error("Excel import error:", error);
        send({ type: "error", error: error?.message || "Could not finish processing the file." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8" },
  });
}) as any;
