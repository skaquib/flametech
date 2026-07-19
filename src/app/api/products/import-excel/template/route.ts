import * as XLSX from "xlsx";
import { auth } from "@/lib/auth";

// GET /api/products/import-excel/template (Admin only) — downloadable .xlsx showing
// the column headers the bulk importer recognizes, with two example rows. The importer
// itself matches header aliases flexibly (case/asterisk/whitespace-insensitive, plus a
// few common alternate spellings per field — see resolveColumns() in ../route.ts), but
// this template uses the canonical spelling so a fresh export starts off matching cleanly.
export const GET = auth(async function GET(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return Response.json({ error: "Access denied." }, { status: 403 });
  }

  const sampleRows = [
    {
      "Item Name": "Gas Solenoid Valve 1/2 inch",
      "Item Code": "SV-001",
      HSN: "84819000",
      "Sale Price": 1500,
      "Online Store Price": 1500,
      "Current Stock Quantity": 25,
      "Minimum Stock Quantity": 5,
      "Tax Rate": "18%",
    },
    {
      "Item Name": "Ignition Electrode Set",
      "Item Code": "IE-002",
      HSN: "85481000",
      "Sale Price": 799,
      "Online Store Price": 799,
      "Current Stock Quantity": 40,
      "Minimum Stock Quantity": 10,
      "Tax Rate": "18%",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleRows);
  ws["!cols"] = [
    { wch: 30 }, // Item Name
    { wch: 14 }, // Item Code
    { wch: 12 }, // HSN
    { wch: 12 }, // Sale Price
    { wch: 16 }, // Online Store Price
    { wch: 18 }, // Current Stock Quantity
    { wch: 18 }, // Minimum Stock Quantity
    { wch: 10 }, // Tax Rate
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Products");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="flametech-product-import-template.xlsx"',
    },
  });
}) as any;
