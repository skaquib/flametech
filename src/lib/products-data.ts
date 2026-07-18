import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

// High fidelity fallback/mock data in case Postgres isn't running yet
export const fallbackProducts = [
  {
    id: "ft-03",
    name: "FlameTech FT-03 Gas Burner",
    slug: "ft-03",
    itemCode: "FT-03-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "High efficiency B2B industrial gas burner for baking and light industry.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "30 - 90 KW" },
      { label: "Gas Flow Rate", value: "3 - 9 m³/h" },
    ],
  },
  {
    id: "ft-05",
    name: "FlameTech FT-05 Gas Burner",
    slug: "ft-05",
    itemCode: "FT-05-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Commercial B2B gas burner for large baking ovens and medium industrial dryers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "50 - 150 KW" },
      { label: "Gas Flow Rate", value: "5 - 15 m³/h" },
    ],
  },
  {
    id: "ft-10",
    name: "FlameTech FT-10 Gas Burner",
    slug: "ft-10",
    itemCode: "FT-10-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "Industrial heavy-duty gas burner for large dryers and steam boilers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "100 - 300 KW" },
      { label: "Gas Flow Rate", value: "10 - 30 m³/h" },
    ],
  },
  {
    id: "ft-15",
    name: "FlameTech FT-15 Gas Burner",
    slug: "ft-15",
    itemCode: "FT-15-GB",
    type: "EQUIPMENT",
    category: { name: "Gas Burners", slug: "gas-burners" },
    shortDesc: "High capacity gas burner for heavy industry, furnaces, and boilers.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Thermal Power", value: "150 - 450 KW" },
      { label: "Gas Flow Rate", value: "15 - 45 m³/h" },
    ],
  },
  {
    id: "semi-auto-panel",
    name: "Semi-Automatic Burner Control Panel",
    slug: "semi-auto-control-panel",
    itemCode: "FT-CP-SA",
    type: "EQUIPMENT",
    category: { name: "Control Panels", slug: "control-panels" },
    shortDesc: "Relay-based industrial burner controller.",
    price: null,
    stockQty: 0,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Enclosure Type", value: "IP54 Mild Steel" },
      { label: "Control Voltage", value: "110V AC" },
    ],
  },
  {
    id: "gas-solenoid",
    name: "Gas Solenoid Valve 1/2\"",
    slug: "gas-solenoid-valve-1-2",
    itemCode: "FT-SP-SV12",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "Class A safety gas solenoid valve, 1/2-inch fitting, 230V.",
    price: 3499,
    stockQty: 45,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Inlet Fitting", value: "1/2 inch BSP" },
      { label: "Operating Voltage", value: "230V AC" },
    ],
  },
  {
    id: "ignition-electrode",
    name: "Ignition Electrode Set",
    slug: "ignition-electrode-set",
    itemCode: "FT-SP-IE-SET",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "Dual electrode spark igniter kit with high-temp ceramic insulation.",
    price: 799,
    stockQty: 120,
    unit: "SET",
    taxRate: "18%",
    specs: [
      { label: "Max Temperature", value: "1300 °C" },
      { label: "Electrode Material", value: "Kanthal A-1" },
    ],
  },
  {
    id: "flame-sensor",
    name: "Flame Sensor Photoelectric Cell",
    slug: "flame-sensor-photocell",
    itemCode: "FT-SP-FC-FLAME",
    type: "PART",
    category: { name: "Spare Parts & Accessories", slug: "spare-parts" },
    shortDesc: "High sensitivity photoelectric photocell flame scanner.",
    price: 1899,
    stockQty: 60,
    unit: "PIECES",
    taxRate: "18%",
    specs: [
      { label: "Spectral Range", value: "190 - 270 nm" },
      { label: "Response Speed", value: "< 100 ms" },
    ],
  },
];

export const fallbackCategories = [
  { name: "Gas Burners", slug: "gas-burners" },
  { name: "Oil Burners", slug: "oil-burners" },
  { name: "Control Panels", slug: "control-panels" },
  { name: "Spare Parts & Accessories", slug: "spare-parts" },
];

// Prisma doesn't go through `fetch`, so a route's `revalidate` export alone does
// nothing for these queries — unstable_cache is what actually caches them across requests.
export const getProducts = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        where: { isActive: true, deletedAt: null },
        include: {
          category: true,
          specs: true,
        },
      });

      if (products.length === 0) return fallbackProducts;
      return products;
    } catch (error) {
      console.error("Database connection failed. Falling back to mock data.", error);
      return fallbackProducts;
    }
  },
  ["products-list"],
  { revalidate: 120, tags: ["products"] }
);

export const getCategories = unstable_cache(
  async () => {
    try {
      const categories = await prisma.category.findMany();
      if (categories.length === 0) return fallbackCategories;
      return categories;
    } catch (error) {
      return fallbackCategories;
    }
  },
  ["categories-list"],
  { revalidate: 300, tags: ["categories"] }
);
