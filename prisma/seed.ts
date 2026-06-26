import { PrismaClient, ProductType, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing database contents
  await prisma.aMCContract.deleteMany({});
  await prisma.quoteRequest.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.productSpec.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.industry.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // 2. Create default categories
  const gasBurnersCategory = await prisma.category.create({
    data: {
      name: "Gas Burners",
      slug: "gas-burners",
    },
  });

  const oilBurnersCategory = await prisma.category.create({
    data: {
      name: "Oil Burners",
      slug: "oil-burners",
    },
  });

  const controlPanelsCategory = await prisma.category.create({
    data: {
      name: "Control Panels",
      slug: "control-panels",
    },
  });

  const sparePartsCategory = await prisma.category.create({
    data: {
      name: "Spare Parts & Accessories",
      slug: "spare-parts",
    },
  });

  console.log("Categories created.");

  // 3. Create default industries served
  const metalIndustry = await prisma.industry.create({
    data: { name: "Metal Production & Powder Coating", category: "INDUSTRY" },
  });

  const chemicalIndustry = await prisma.industry.create({
    data: { name: "Chemical & Pharmaceutical Plants", category: "CHEMICAL" },
  });

  const bakeryIndustry = await prisma.industry.create({
    data: { name: "Commercial Bakeries & Food Ovens", category: "FOOD" },
  });

  console.log("Industries created.");

  // 4. Create default users
  const adminPasswordHash = await bcrypt.hash("AdminFlameTech123!", 10);
  const customerPasswordHash = await bcrypt.hash("Customer123!", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "FlameTech Admin",
      email: "admin@flametech.com",
      phone: "+919876543210",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      company: "FlameTech Engineering",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "B2B Client Ltd",
      email: "customer@gmail.com",
      phone: "+919876543211",
      passwordHash: customerPasswordHash,
      role: Role.CUSTOMER,
      company: "Reliance Industries",
    },
  });

  console.log("Users created.");

  // 5. Create products
  // 5.1 Gas Burners (EQUIPMENT, Quote flow)
  const burners = [
    {
      name: "FlameTech FT-03 Gas Burner",
      slug: "ft-03",
      itemCode: "FT-03-GB",
      shortDesc: "High efficiency B2B industrial gas burner for baking and light industry.",
      description: "The FlameTech FT-03 is engineered for maximum fuel savings and thermal efficiency in small-scale bakeries and powder coating ovens. Featuring automatic ignition and a highly stable gas mixing nozzle.",
      specs: [
        { label: "Thermal Power (KW)", value: "30 - 90" },
        { label: "Thermal Power (Kcal/h)", value: "25,000 - 77,000" },
        { label: "Gas Flow Rate", value: "3 - 9 m³/h" },
        { label: "Gas Pressure Range", value: "20 - 50 mbar" },
        { label: "Motor Power (W)", value: "90 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
    },
    {
      name: "FlameTech FT-05 Gas Burner",
      slug: "ft-05",
      itemCode: "FT-05-GB",
      shortDesc: "Commercial B2B gas burner for large baking ovens and medium industrial dryers.",
      description: "The FT-05 burner provides reliable temperature control and homogeneous flame distribution. Ideal for industrial baking, boiler retrofitting, and metal pre-treatment plants.",
      specs: [
        { label: "Thermal Power (KW)", value: "50 - 150" },
        { label: "Thermal Power (Kcal/h)", value: "43,000 - 129,000" },
        { label: "Gas Flow Rate", value: "5 - 15 m³/h" },
        { label: "Gas Pressure Range", value: "20 - 50 mbar" },
        { label: "Motor Power (W)", value: "150 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
    },
    {
      name: "FlameTech FT-10 Gas Burner",
      slug: "ft-10",
      itemCode: "FT-10-GB",
      shortDesc: "Industrial heavy-duty gas burner for large dryers and steam boilers.",
      description: "Designed for high-demand industrial process heat, the FT-10 features a modular design with custom flame configurations. Perfect for asphalt mixing plants, large boiler units, and chemical process heating.",
      specs: [
        { label: "Thermal Power (KW)", value: "100 - 300" },
        { label: "Thermal Power (Kcal/h)", value: "86,000 - 258,000" },
        { label: "Gas Flow Rate", value: "10 - 30 m³/h" },
        { label: "Gas Pressure Range", value: "25 - 60 mbar" },
        { label: "Motor Power (W)", value: "250 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
    },
    {
      name: "FlameTech FT-15 Gas Burner",
      slug: "ft-15",
      itemCode: "FT-15-GB",
      shortDesc: "High capacity gas burner for heavy industry, furnaces, and boilers.",
      description: "The FT-15 model is tailored for severe environments where raw power and precise control are critical. Excellent efficiency with modern air-gas ratio controls.",
      specs: [
        { label: "Thermal Power (KW)", value: "150 - 450" },
        { label: "Thermal Power (Kcal/h)", value: "129,000 - 387,000" },
        { label: "Gas Flow Rate", value: "15 - 45 m³/h" },
        { label: "Gas Pressure Range", value: "30 - 80 mbar" },
        { label: "Motor Power (W)", value: "370 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
    },
    {
      name: "FlameTech FT-20 Gas Burner",
      slug: "ft-20",
      itemCode: "FT-20-GB",
      shortDesc: "Extreme duty double stage industrial gas burner.",
      description: "FlameTech's FT-20 double-stage gas burner is built for metallurgical processing, rotary kilns, and large utility boilers, minimizing thermal shock via smooth high/low flame transitions.",
      specs: [
        { label: "Thermal Power (KW)", value: "250 - 750" },
        { label: "Thermal Power (Kcal/h)", value: "215,000 - 645,000" },
        { label: "Gas Flow Rate", value: "25 - 75 m³/h" },
        { label: "Gas Pressure Range", value: "40 - 100 mbar" },
        { label: "Motor Power (W)", value: "750 W" },
        { label: "Power Supply", value: "415V / 3Ph / 50Hz" },
      ],
    },
    {
      name: "FlameTech FT-25 Gas Burner",
      slug: "ft-25",
      itemCode: "FT-25-GB",
      shortDesc: "Super capacity industrial process burner for steel plants and utility power.",
      description: "Our flagship FT-25 industrial burner represents the peak of gas-firing technology. Delivers extreme heat output while complying with strict NOx emissions criteria.",
      specs: [
        { label: "Thermal Power (KW)", value: "400 - 1200" },
        { label: "Thermal Power (Kcal/h)", value: "344,000 - 1,032,000" },
        { label: "Gas Flow Rate", value: "40 - 120 m³/h" },
        { label: "Gas Pressure Range", value: "50 - 120 mbar" },
        { label: "Motor Power (W)", value: "1500 W" },
        { label: "Power Supply", value: "415V / 3Ph / 50Hz" },
      ],
    },
  ];

  for (const b of burners) {
    const createdProduct = await prisma.product.create({
      data: {
        name: b.name,
        slug: b.slug,
        itemCode: b.itemCode,
        type: ProductType.EQUIPMENT,
        categoryId: gasBurnersCategory.id,
        shortDesc: b.shortDesc,
        description: b.description,
        price: null, // B2B quote only
        hsn: "84162000",
        taxRate: "18%",
        unit: "SET",
        isActive: true,
        datasheetUrl: `/datasheets/${b.slug}-spec.pdf`,
        images: {
          create: [
            {
              url: `/images/${b.slug}.jpg`,
              altText: b.name,
              position: 0,
            },
          ],
        },
        specs: {
          create: b.specs,
        },
        industries: {
          connect: [
            { id: metalIndustry.id },
            { id: chemicalIndustry.id },
            { id: bakeryIndustry.id },
          ],
        },
      },
    });
  }

  // 5.2 Control Panels (EQUIPMENT, Quote flow)
  const panels = [
    {
      name: "Semi-Automatic Burner Control Panel",
      slug: "semi-auto-control-panel",
      itemCode: "FT-CP-SA",
      shortDesc: "Relay-based industrial burner controller.",
      description: "Features push-button ignition controls, flame failure alarms, fuel cut-off interlocks, and digital temperature indicators. Fully pre-wired and tested.",
      specs: [
        { label: "Enclosure Type", value: "IP54 Mild Steel" },
        { label: "Control Voltage", value: "110V AC" },
        { label: "Indicators", value: "Power, Ignition, Flame On, Alarm" },
      ],
    },
    {
      name: "Fully-Automatic PLC Control Panel",
      slug: "plc-control-panel",
      itemCode: "FT-CP-PLC",
      shortDesc: "Microprocessor/PLC-driven burner management panel.",
      description: "Top-tier safety panel with Siemens PLC core, 7-inch touch HMI screen, temperature profile programming, Modbus integration, and historical alarm logs.",
      specs: [
        { label: "PLC Core Type", value: "Siemens S7-1200" },
        { label: "Interface", value: "7-Inch Color HMI Touch" },
        { label: "Communication", value: "Modbus TCP/IP, RS485" },
      ],
    },
  ];

  for (const p of panels) {
    await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        itemCode: p.itemCode,
        type: ProductType.EQUIPMENT,
        categoryId: controlPanelsCategory.id,
        shortDesc: p.shortDesc,
        description: p.description,
        price: null, // B2B quote only
        hsn: "85371000",
        taxRate: "18%",
        unit: "SET",
        isActive: true,
        images: {
          create: [
            {
              url: `/images/${p.slug}.jpg`,
              altText: p.name,
              position: 0,
            },
          ],
        },
        specs: {
          create: p.specs,
        },
      },
    });
  }

  // 5.3 Spare Parts & Spares (PART, E-commerce buy flow)
  const parts = [
    {
      name: "Gas Solenoid Valve 1/2\"",
      slug: "gas-solenoid-valve-1-2",
      itemCode: "FT-SP-SV12",
      shortDesc: "Class A safety gas solenoid valve, 1/2-inch fitting, 230V.",
      description: "Direct-acting safety shutoff solenoid valve. Built from premium die-cast brass. Quick opening and quick closing (< 1s) to guarantee instantaneous fuel shutoff.",
      price: 3499,
      hsn: "84818030",
      taxRate: "18%",
      stockQty: 45,
      unit: "PIECES",
      specs: [
        { label: "Inlet Fitting", value: "1/2 inch BSP" },
        { label: "Operating Voltage", value: "230V AC / 50Hz" },
        { label: "Maximum Pressure", value: "200 mbar" },
      ],
    },
    {
      name: "Ignition Electrode Set",
      slug: "ignition-electrode-set",
      itemCode: "FT-SP-IE-SET",
      shortDesc: "Dual electrode spark igniter kit with high-temp ceramic insulation.",
      description: "Replacement dual electrode spark set suitable for FT-03 and FT-05 burners. Glazed alumina ceramic sheath handles heat up to 1300°C.",
      price: 799,
      hsn: "85118000",
      taxRate: "18%",
      stockQty: 120,
      unit: "SET",
      specs: [
        { label: "Max Temperature", value: "1300 °C" },
        { label: "Electrode Material", value: "Kanthal A-1" },
        { label: "Insulator Length", value: "85 mm" },
      ],
    },
    {
      name: "Flame Sensor Photoelectric Cell",
      slug: "flame-sensor-photocell",
      itemCode: "FT-SP-FC-FLAME",
      shortDesc: "High sensitivity photoelectric photocell flame scanner.",
      description: "Standard UV/visible light photocell sensor for automatic burner flame supervision. Includes mounting bracket and 1.5-meter heat-shielded cable.",
      price: 1899,
      hsn: "90275000",
      taxRate: "18%",
      stockQty: 60,
      unit: "PIECES",
      specs: [
        { label: "Spectral Range", value: "190 - 270 nm (UV)" },
        { label: "Response Speed", value: "< 100 ms" },
        { label: "Cable Rating", value: "180°C Silicone Shielded" },
      ],
    },
    {
      name: "Gas Burner Control Box (Automatic)",
      slug: "burner-control-box",
      itemCode: "FT-SP-CB-AUTO",
      shortDesc: "Microprocessor burner control box for single/double stage burners.",
      description: "Controls startup, flame monitoring, ignition, and fuel valve relays. Integrates self-checking diagnostic routines and lock-out reset switches.",
      price: 8500,
      hsn: "85371090",
      taxRate: "18%",
      stockQty: 15,
      unit: "PIECES",
      specs: [
        { label: "Controller Type", value: "Digital Microprocessor" },
        { label: "Ignition Safety Time", value: "3 seconds" },
        { label: "Purge Time", value: "30 seconds" },
      ],
    },
    {
      name: "High Pressure Gas Hose (Flexible)",
      slug: "high-pressure-gas-hose",
      itemCode: "FT-SP-HPHOSE",
      shortDesc: "Stainless steel braided flexible gas piping, 1 meter.",
      description: "High-integrity SS304 braided corrugated gas hose designed for vibrating environments. Eliminates stress on burners during burner head adjustments.",
      price: 1250,
      hsn: "40092100",
      taxRate: "18%",
      stockQty: 80,
      unit: "PIECES",
      specs: [
        { label: "Hose Material", value: "Corrugated SS304" },
        { label: "Braid Material", value: "Stainless Steel SS304" },
        { label: "Connectors", value: "1/2 inch Swivel Unions" },
      ],
    },
  ];

  for (const part of parts) {
    await prisma.product.create({
      data: {
        name: part.name,
        slug: part.slug,
        itemCode: part.itemCode,
        type: ProductType.PART,
        categoryId: sparePartsCategory.id,
        shortDesc: part.shortDesc,
        description: part.description,
        price: part.price,
        hsn: part.hsn,
        taxRate: part.taxRate,
        stockQty: part.stockQty,
        unit: part.unit,
        isActive: true,
        images: {
          create: [
            {
              url: `/images/${part.slug}.jpg`,
              altText: part.name,
              position: 0,
            },
          ],
        },
        specs: {
          create: part.specs,
        },
      },
    });
  }

  // 5.4 Seed an AMC Service package (SERVICE type, Direct AMC buy/info)
  await prisma.product.create({
    data: {
      name: "FlameTech Professional AMC Contract",
      slug: "amc-service-contract",
      itemCode: "FT-SVC-AMC",
      type: ProductType.SERVICE,
      categoryId: gasBurnersCategory.id,
      shortDesc: "Annual Maintenance Contract - 1 Year coverage including bi-monthly site maintenance.",
      description: "Ensure zero downtime for your industrial ovens. Includes 6 scheduled maintenance visits per year (every 2 months), comprehensive safety interlock calibration, combustion analysis, and combustion head cleaning.",
      price: 4794, // ₹799 x 6 visits = ₹4,794 (excludes GST)
      hsn: "998719",
      taxRate: "18%",
      stockQty: 999,
      unit: "YEAR",
      isActive: true,
      images: {
        create: [
          {
            url: "/images/amc-service.jpg",
            altText: "FlameTech AMC Service",
            position: 0,
          },
        ],
      },
      specs: {
        create: [
          { label: "Visits Frequency", value: "Every 60 Days (Bi-monthly)" },
          { label: "Included Service", value: "Combustion Analysis, Calibration, Nozzle Check" },
          { label: "Response SLA", value: "Within 24 Hours in Service Areas" },
        ],
      },
    },
  });

  console.log("Products, parts, and service packages seeded successfully!");
  console.log("Database seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error during seeding process:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
