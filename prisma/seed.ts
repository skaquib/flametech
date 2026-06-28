import { PrismaClient, ProductType, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

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

async function main() {
  console.log("Starting full database seeding from Export Items.xlsx ...");

  // 1. Clean existing database
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

  // 2. Categories
  const gasBurnersCategory = await prisma.category.create({
    data: { name: "Gas Burners", slug: "gas-burners" },
  });
  const oilBurnersCategory = await prisma.category.create({
    data: { name: "Oil & Diesel Burners", slug: "oil-burners" },
  });
  const controlPanelsCategory = await prisma.category.create({
    data: { name: "Control Panels", slug: "control-panels" },
  });
  const sparePartsCategory = await prisma.category.create({
    data: { name: "Spare Parts & Accessories", slug: "spare-parts" },
  });
  const servicesCategory = await prisma.category.create({
    data: { name: "Services & AMC", slug: "services" },
  });

  console.log("Categories created.");

  // 3. Industries
  const metalIndustry = await prisma.industry.create({
    data: { name: "Metal Production & Powder Coating", category: "INDUSTRY" },
  });
  const chemicalIndustry = await prisma.industry.create({
    data: { name: "Chemical & Pharmaceutical Plants", category: "CHEMICAL" },
  });
  const bakeryIndustry = await prisma.industry.create({
    data: { name: "Commercial Bakeries & Food Ovens", category: "FOOD" },
  });
  const textileIndustry = await prisma.industry.create({
    data: { name: "Textile & Dyeing Units", category: "INDUSTRY" },
  });
  const ceramicsIndustry = await prisma.industry.create({
    data: { name: "Ceramics & Glass Manufacturing", category: "INDUSTRY" },
  });
  const hospitalityIndustry = await prisma.industry.create({
    data: { name: "Hotels & Commercial Kitchens", category: "FOOD" },
  });

  console.log("Industries created.");

  // 4. Users
  const adminEmail = process.env.ADMIN_EMAIL || "admin@flametech.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminFlameTech123!";
  
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const customerHash = await bcrypt.hash("Customer123!", 10);

  await prisma.user.create({
    data: {
      name: "FlameTech Admin",
      email: adminEmail,
      phone: "+919768417740",
      passwordHash: adminHash,
      role: Role.ADMIN,
      company: "FlameTech Engineering",
    },
  });

  await prisma.user.create({
    data: {
      name: "B2B Client Ltd",
      email: "customer@gmail.com",
      phone: "+919876543211",
      passwordHash: customerHash,
      role: Role.CUSTOMER,
      company: "Reliance Industries",
    },
  });

  console.log("Users created.");

  // ============================================================
  // 5. GAS BURNERS (from Excel + enriched FlameTech product line)
  // ============================================================
  const gasBurners = [
    {
      name: "FT-3 Fully Automatic Gas Burner",
      slug: "ft-3-gas-burner",
      itemCode: "FT(3)-GB",
      shortDesc: "Compact fully-automatic gas burner for small bakeries, kitchen ovens and textile dryers.",
      description:
        "The FlameTech FT-3 is a fully automatic single-stage gas burner engineered for compact industrial and commercial applications. Ideal for bakery ovens, institutional kitchens, and light-duty process dryers. Features automatic pilot ignition, flame-failure safety lockout via photocell, and a stable combustion head. Whisper-quiet blower motor with anti-vibration mounts. Runs on LPG or natural gas. Plug-and-play installation with integrated sequence controller.",
      price: 18000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 5,
      unit: "SET",
      slug_img: "ft-03",
      specs: [
        { label: "Thermal Output", value: "35,000 Kcal/hr (40 KW)" },
        { label: "Fuel Type", value: "LPG / Natural Gas / PNG" },
        { label: "Gas Pressure", value: "20 – 50 mbar" },
        { label: "Motor Power", value: "90 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Ignition Type", value: "Automatic Spark Ignition" },
        { label: "Control Type", value: "Single Stage (On/Off)" },
        { label: "HSN Code", value: "84162000" },
      ],
      industries: ["metal", "bakery", "hospitality"],
    },
    {
      name: "FT-5 Fully Automatic Gas Burner",
      slug: "ft-5-gas-burner",
      itemCode: "FT(5)-GB",
      shortDesc: "High-efficiency single-stage gas burner for medium industrial ovens and boilers.",
      description:
        "The FT-5 fully automatic gas burner delivers reliable performance for medium-capacity industrial heating. Used extensively in paint ovens, pre-treatment tunnels, bakery tunnel ovens, and hot water boilers. The precise air-gas modulation nozzle ensures clean combustion with minimal NOx. Anti-flame rollback system, built-in ignition transformer, and sealed combustion head for outdoor-rated enclosures.",
      price: 32000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 8,
      unit: "SET",
      slug_img: "ft-05",
      specs: [
        { label: "Thermal Output", value: "90,000 Kcal/hr (105 KW)" },
        { label: "Fuel Type", value: "LPG / Natural Gas / PNG" },
        { label: "Gas Pressure", value: "20 – 50 mbar" },
        { label: "Motor Power", value: "135 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Ignition Type", value: "Automatic Spark + Photocell" },
        { label: "Control Type", value: "Single Stage" },
        { label: "Blast Tube", value: "6 inch SS" },
        { label: "HSN Code", value: "84162000" },
      ],
      industries: ["metal", "bakery", "chemical"],
    },
    {
      name: "FT-5 Two Stage High-Capacity Gas Burner",
      slug: "ft-5-two-stage-gas-burner",
      itemCode: "FT(5)-2S-GB",
      shortDesc: "Two-stage modulating gas burner for precision temperature industrial applications.",
      description:
        "Upgraded dual-stage variant of the FT-5. The two-stage control allows precise temperature profiling — switching between low and high fire — reducing thermal shock in sensitive processes. Suitable for ceramic kilns, glass annealing ovens, pharmaceutical autoclaves and large commercial kitchens. Includes Brahma or Siemens programmable sequence controller.",
      price: 27000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 4,
      unit: "SET",
      slug_img: "ft-05",
      specs: [
        { label: "Thermal Output", value: "90,000 – 140,000 Kcal/hr" },
        { label: "Fuel Type", value: "LPG / Natural Gas" },
        { label: "Control Type", value: "Two Stage (High/Low Fire)" },
        { label: "Motor Power", value: "135 W" },
        { label: "Sequence Controller", value: "Brahma / Siemens" },
        { label: "Blast Tube", value: "10 inch SS" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
      industries: ["metal", "chemical", "ceramics"],
    },
    {
      name: "FT-10 Fully Automatic Gas Burner",
      slug: "ft-10-gas-burner",
      itemCode: "FT(10)-GB",
      shortDesc: "Heavy-duty industrial gas burner for large process ovens and steam boilers.",
      description:
        "The FT-10 is FlameTech's workhorse burner for demanding industrial applications. With an output of 110,000 Kcal/hr, it handles large tunnel ovens, autoclave sterilizers, industrial dryers, and steam generation boilers. Robust cast-iron body withstands harsh environments. The integrated air pressure switch prevents unsafe ignition if airflow is insufficient. Suitable for 24/7 continuous operation.",
      price: 35000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 6,
      unit: "SET",
      slug_img: "ft-10",
      specs: [
        { label: "Thermal Output", value: "110,000 Kcal/hr (128 KW)" },
        { label: "Fuel Type", value: "LPG / Natural Gas / CNG" },
        { label: "Gas Pressure", value: "25 – 60 mbar" },
        { label: "Motor Power", value: "200 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Ignition Type", value: "Automatic Spark + Photocell" },
        { label: "Control Type", value: "Single / Two Stage" },
        { label: "Blast Tube", value: "12 inch SS" },
        { label: "HSN Code", value: "84162000" },
      ],
      industries: ["metal", "chemical", "ceramics"],
    },
    {
      name: "FT-15 Single Stage Gas Burner",
      slug: "ft-15-gas-burner",
      itemCode: "FT(15)-SS-GB",
      shortDesc: "Powerful single-stage gas burner for large industrial furnaces and steam boilers.",
      description:
        "Engineered for high-throughput industrial processes, the FT-15 single-stage gas burner provides consistent and stable high-heat output for continuous process requirements. Ideal for large asphalt mixing plants, galvanizing furnaces, steel heat treatment ovens, and utility steam boilers. Features an industrial-grade modulation head, high-tension ignition transformer, and fail-safe solenoid valve cutoff.",
      price: 46000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 3,
      unit: "SET",
      slug_img: "ft-15",
      specs: [
        { label: "Thermal Output", value: "150,000 Kcal/hr (175 KW)" },
        { label: "Fuel Type", value: "LPG / Natural Gas / CNG" },
        { label: "Gas Pressure", value: "30 – 80 mbar" },
        { label: "Motor Power", value: "200 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Ignition", value: "Automatic Spark" },
        { label: "Blast Tube Diameter", value: "14 inch SS" },
      ],
      industries: ["metal", "chemical"],
    },
    {
      name: "FT-15 Two Stage High-Temperature Gas Burner",
      slug: "ft-15-two-stage-gas-burner",
      itemCode: "FT(15)-2S-HT",
      shortDesc: "Two-stage ultra-high-temperature gas burner for 1,500°C+ kilns and furnaces.",
      description:
        "The FT-15 two-stage high-temperature variant is purpose-built for extreme thermal environments: ceramic and glass kilns, forging furnaces, and heat treatment chambers. The two-stage firing mode allows operators to ramp up temperature gradually, preventing thermal cracking of the kiln lining. Rated for up to 1,500°C. Includes refractory-grade blast tube and silicone-cable-rated photocell.",
      price: 45000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 2,
      unit: "SET",
      slug_img: "ft-15",
      specs: [
        { label: "Thermal Output", value: "150,000 – 200,000 Kcal/hr" },
        { label: "Max Furnace Temp", value: "1,500 °C" },
        { label: "Fuel Type", value: "LPG / Natural Gas" },
        { label: "Motor Power", value: "200 W" },
        { label: "Control Type", value: "Two Stage (High/Low Fire)" },
        { label: "Blast Tube", value: "Refractory Grade, 14 inch" },
      ],
      industries: ["metal", "ceramics"],
    },
    {
      name: "FT-25 Industrial Process Gas Burner",
      slug: "ft-25-gas-burner",
      itemCode: "FT25-IND-GB",
      shortDesc: "Super-capacity industrial gas burner for steel, asphalt and power plants. 450,000 Kcal/hr.",
      description:
        "FlameTech's flagship FT-25 is the highest-output gas burner in our lineup, delivering 450,000 Kcal/hr through a 6-inch stainless steel blast tube. Powered by a 1HP motor and controlled by a Siemens LME22/LME73 sequence controller, it features an air damper servo motor for precise oxygen ratio control. CE-compliant low-NOx combustion design. This burner is engineered for rotary kilns, asphalt drum mixers, large industrial boilers, and steel plant auxiliary systems.",
      price: null, // Quote only
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 2,
      unit: "SET",
      slug_img: "ft-25",
      specs: [
        { label: "Thermal Output", value: "450,000 Kcal/hr (523 KW)" },
        { label: "Fuel Type", value: "Natural Gas / LPG / CNG" },
        { label: "Gas Pressure", value: "50 – 120 mbar" },
        { label: "Motor Power", value: "1 HP (750 W)" },
        { label: "Power Supply", value: "415V / 3Ph / 50Hz" },
        { label: "Sequence Controller", value: "Siemens LME22 / LME73" },
        { label: "Air Damper", value: "Servo Motor Actuated" },
        { label: "Blast Tube", value: "6 inch Width SS" },
        { label: "NOx Class", value: "Low-NOx CE Certified" },
        { label: "HSN Code", value: "84162000" },
      ],
      industries: ["metal", "chemical", "ceramics"],
    },
    {
      name: "250 KW Light Diesel Oil Burner",
      slug: "250kw-ldo-burner",
      itemCode: "LDO-250KW",
      shortDesc: "250 KW light diesel oil industrial burner for boilers and ovens.",
      description:
        "Industrial LDO (Light Diesel Oil) burner delivering 250 KW of thermal power. Compatible with LSHS, HSD, and light fuel oils. Features a Delavan/Suntec oil nozzle assembly, high-voltage ignition electrode, safety photocell, and integrated oil pump. Suitable for industrial steam boilers, textile stenter machines, and pharmaceutical water-for-injection distillation units.",
      price: 50000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 2,
      unit: "SET",
      slug_img: "ftd-10",
      specs: [
        { label: "Thermal Output", value: "250 KW (215,000 Kcal/hr)" },
        { label: "Fuel Type", value: "Light Diesel Oil (LDO / HSD)" },
        { label: "Oil Nozzle", value: "Delavan / Monarch" },
        { label: "Oil Pump", value: "Suntec / Tigerloop" },
        { label: "Motor Power", value: "250 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
      industries: ["metal", "chemical"],
    },
    {
      name: "FTD-5 Diesel Burner",
      slug: "ftd-5-diesel-burner",
      itemCode: "FTD(5)-DB",
      shortDesc: "Light-duty diesel oil burner for small commercial boilers and dryers.",
      description:
        "The FTD-5 is a single-stage diesel oil burner for light commercial and industrial heating applications. Features Riello/Suntec oil pump, stainless steel nozzle body, and self-cleaning combustion head. Designed for HSD (High Speed Diesel) fuel. Suitable for small industrial ovens, steam washers, and autoclave boilers.",
      price: 5000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 3,
      unit: "SET",
      slug_img: "ftd-10",
      specs: [
        { label: "Thermal Output", value: "45,000 Kcal/hr (52 KW)" },
        { label: "Fuel Type", value: "HSD / Diesel" },
        { label: "Oil Pump", value: "Suntec / Riello" },
        { label: "Motor Power", value: "90 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
      ],
      industries: ["metal", "bakery"],
    },
    {
      name: "FTD-10 Industrial Oil Burner",
      slug: "ftd-10-oil-burner",
      itemCode: "FTD(10)-OB",
      shortDesc: "Heavy-duty diesel oil burner for large industrial process heating.",
      description:
        "The FTD-10 is our premier diesel oil burner for heavy-duty industrial applications. Features a dual-atomizing nozzle system, high-pressure oil pump, and ceramic combustion head. Perfect for large industrial boilers, textile stenters, and annealing furnaces. CE-marked components throughout with IP54-rated motor and weatherproof enclosure.",
      price: 56000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 2,
      unit: "SET",
      slug_img: "ftd-10",
      specs: [
        { label: "Thermal Output", value: "100,000 Kcal/hr (116 KW)" },
        { label: "Fuel Type", value: "HSD / LDO / Diesel" },
        { label: "Oil Nozzle", value: "Dual Atomizing" },
        { label: "Motor Power", value: "200 W (IP54 Rated)" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Oil Pressure", value: "10 – 20 bar" },
        { label: "HSN Code", value: "84162000" },
      ],
      industries: ["metal", "chemical"],
    },
    {
      name: "FTD-12 Oil Burner",
      slug: "ftd-12-oil-burner",
      itemCode: "FTD(12)-OB",
      shortDesc: "Medium-heavy oil burner for boilers and industrial ovens.",
      description:
        "The FTD-12 oil burner provides reliable mid-range heating for industrial boilers, steam generators, and large ovens. Designed for continuous duty operation with a high-pressure oil nozzle, purge cycle, and automatic flame supervision. Weatherproof IP54 motor enclosure.",
      price: 42000,
      hsn: "84162000",
      taxRate: "GST@18%",
      stockQty: 2,
      unit: "SET",
      slug_img: "ftd-10",
      specs: [
        { label: "Thermal Output", value: "120,000 Kcal/hr (140 KW)" },
        { label: "Fuel Type", value: "HSD / LDO" },
        { label: "Motor Power", value: "200 W" },
        { label: "Power Supply", value: "230V / 1Ph / 50Hz" },
        { label: "Purge Time", value: "30 seconds" },
      ],
      industries: ["metal", "chemical"],
    },
  ];

  // ============================================================
  // 6. CONTROL PANELS
  // ============================================================
  const controlPanels = [
    {
      name: "1 Burner 1 Motor Control Panel",
      slug: "1-burner-1-motor-panel",
      itemCode: "FT-CP-1B1M",
      shortDesc: "Pre-wired relay-based control panel for single burner with single motor drive.",
      description:
        "Factory-assembled and tested relay-based control panel for one burner and one motor. Includes power on/off indicator, start/stop pushbuttons, flame-on indicator, fault alarm, and motor overload protection relay. IP54 mild-steel enclosure with cable glands. Plug-and-play wiring with labeled terminal strips. Ideal for small baking or textile ovens.",
      price: 16000,
      hsn: "85371000",
      taxRate: "GST@18%",
      stockQty: 5,
      unit: "SET",
      slug_img: "semi-auto-control-panel",
      specs: [
        { label: "Enclosure", value: "IP54 Mild Steel" },
        { label: "Control Voltage", value: "230V AC" },
        { label: "Motor Phases", value: "Single Phase" },
        { label: "Indicators", value: "Power, Flame ON, Fault" },
        { label: "Overload Protection", value: "Thermal Overload Relay" },
        { label: "Burners Supported", value: "1" },
        { label: "Motors Supported", value: "1" },
      ],
    },
    {
      name: "1 Burner 2 Motor Control Panel",
      slug: "1-burner-2-motor-panel",
      itemCode: "FT-CP-1B2M",
      shortDesc: "Industrial control panel for one burner and two-motor drive system.",
      description:
        "Industrial-grade control panel for ovens requiring one burner and two separate motor drives (e.g., conveyor + exhaust fan). Relay-controlled start sequence, flame supervision, thermal overload per motor, and an alarm buzzer on fault. Suitable for tunnel ovens, large batch ovens, and industrial dryers.",
      price: 12000,
      hsn: "85371000",
      taxRate: "GST@18%",
      stockQty: 4,
      unit: "SET",
      slug_img: "semi-auto-control-panel",
      specs: [
        { label: "Enclosure", value: "IP54 Mild Steel" },
        { label: "Control Voltage", value: "230V AC" },
        { label: "Burners Supported", value: "1" },
        { label: "Motors Supported", value: "2" },
        { label: "Overload Protection", value: "Per Motor Thermal Relay" },
        { label: "Alarm", value: "Buzzer + Indicator Light" },
      ],
    },
    {
      name: "2 Motor 1 Burner Heavy Duty Control Panel",
      slug: "2-motor-1-burner-hd-panel",
      itemCode: "FT-CP-2M1B-HD",
      shortDesc: "Heavy-duty control panel with 3-phase motor drives and burner management.",
      description:
        "Heavy-duty 3-phase control panel for large ovens with two motor drives (main conveyor + exhaust blower) and one burner. Includes 3-phase DOL starters, safety contactor interlocking, temperature setpoint controller integration, and IP55 weatherproof enclosure. Suitable for powder coating ovens, industrial paint booths, and large pharmaceutical process ovens.",
      price: 18000,
      hsn: "85371000",
      taxRate: "GST@18%",
      stockQty: 3,
      unit: "SET",
      slug_img: "plc-control-panel",
      specs: [
        { label: "Enclosure", value: "IP55 Powder-Coated Steel" },
        { label: "Control Voltage", value: "415V AC / 3Ph" },
        { label: "Motor Starter Type", value: "DOL 3-Phase" },
        { label: "Burners Supported", value: "1" },
        { label: "Motors Supported", value: "2 (3-Phase)" },
        { label: "Temperature Control", value: "Integrated Setpoint Controller" },
      ],
    },
    {
      name: "Oven Control Panel with Temperature Controller",
      slug: "oven-control-panel",
      itemCode: "FT-CP-OCP",
      shortDesc: "Complete oven control panel with PID temperature controller and digital display.",
      description:
        "All-in-one oven control panel featuring a PID digital temperature controller, thermocouple input (K or J type), on/off burner relay, conveyor speed controller, and digital process indicators. Designed for precise temperature management in industrial and commercial ovens. Includes selector switch for manual/auto operation.",
      price: 10000,
      hsn: "85371000",
      taxRate: "GST@18%",
      stockQty: 6,
      unit: "SET",
      slug_img: "oven-control-panel",
      specs: [
        { label: "Temperature Controller", value: "PID Digital (±1°C)" },
        { label: "Thermocouple Input", value: "K-Type / J-Type" },
        { label: "Temperature Range", value: "0 – 1200 °C" },
        { label: "Display", value: "Digital LED Readout" },
        { label: "Control Mode", value: "Manual / Auto Selector" },
        { label: "Enclosure", value: "IP54 Powder-Coated" },
      ],
    },
    {
      name: "Control Panel & Accessories Kit",
      slug: "control-panel-accessories-kit",
      itemCode: "FT-CP-ACC",
      shortDesc: "Complete panel accessory set: relays, switches, indicators, terminals.",
      description:
        "A curated kit of industrial-grade panel accessories for burner control panel assembly or upgrade. Includes selector switches, push buttons, relays, indicator lights, terminal blocks, and cable glands. Sourced from reputed brands (Schneider, Siemens, L&T). Essential for panel builders and plant maintenance teams.",
      price: 12500,
      hsn: "85371000",
      taxRate: "GST@18%",
      stockQty: 10,
      unit: "SET",
      slug_img: "semi-auto-control-panel",
      specs: [
        { label: "Relay Type", value: "LY4N 14-Pin / LY2 8-Pin" },
        { label: "Push Buttons", value: "Industrial IP65 Green/Red" },
        { label: "Terminal Blocks", value: "Wago / Phoenix Contact" },
        { label: "Indicator Lights", value: "22mm LED 230V" },
      ],
    },
  ];

  // ============================================================
  // 7. SPARE PARTS (key items from Excel)
  // ============================================================
  const spareParts = [
    // SOLENOID VALVES
    {
      name: "Solenoid Valve Brass 1/2\" (Gas)",
      slug: "solenoid-valve-brass-half",
      itemCode: "SV-BRASS-1/2",
      shortDesc: "Class A safety solenoid valve, brass body, 1/2 inch BSP, 230V for gas shutoff.",
      description:
        "Direct-acting safety shutoff solenoid valve with die-cast brass body. Opens when energized, closes instantly (< 1s) on power loss. Class A certified for safe gas shutoff. Compatible with LPG, natural gas, and CNG. Suitable for all FlameTech burner models.",
      price: 3500,
      hsn: "84818030",
      taxRate: "GST@18%",
      stockQty: 45,
      unit: "PIECES",
      slug_img: "gas-solenoid-valve-1-2",
      specs: [
        { label: "Body Material", value: "Die-Cast Brass" },
        { label: "Port Size", value: "1/2 inch BSP" },
        { label: "Operating Voltage", value: "230V AC / 50Hz" },
        { label: "Max Working Pressure", value: "200 mbar" },
        { label: "Response Time", value: "< 1 second" },
        { label: "Approvals", value: "CE / EN161 Class A" },
      ],
    },
    {
      name: "Solenoid Valve EG12 (Gas)",
      slug: "solenoid-valve-eg12",
      itemCode: "SV-EG12",
      shortDesc: "Brahma EG12 gas solenoid valve for fully automatic burner systems.",
      description:
        "Brahma EG12 series gas solenoid valve for use in automatic single or double-stage gas burners. Features quick-open quick-close mechanism, IP54 coil, and ATEX-rated construction. Approved for natural gas and LPG service up to 500 mbar.",
      price: 4500,
      hsn: "84818030",
      taxRate: "GST@18%",
      stockQty: 20,
      unit: "PIECES",
      slug_img: "gas-solenoid-valve-1-2",
      specs: [
        { label: "Model", value: "Brahma EG12" },
        { label: "Port Size", value: "3/4 inch BSP" },
        { label: "Operating Voltage", value: "230V AC / 50Hz" },
        { label: "Max Pressure", value: "500 mbar" },
        { label: "Coil Rating", value: "IP54" },
      ],
    },
    {
      name: "Solenoid Valve E6G (Gas)",
      slug: "solenoid-valve-e6g",
      itemCode: "SV-E6G",
      shortDesc: "Brahma E6G single-body gas solenoid valve for smaller burners.",
      description:
        "Brahma E6G gas solenoid valve designed for use with small to medium gas burners (FT-3, FT-5). Compact single-body construction with 1/2 inch BSP connection. Fail-safe normally-closed design. CE approved.",
      price: 4000,
      hsn: "84818030",
      taxRate: "GST@18%",
      stockQty: 15,
      unit: "PIECES",
      slug_img: "gas-solenoid-valve-1-2",
      specs: [
        { label: "Model", value: "Brahma E6G" },
        { label: "Port Size", value: "1/2 inch BSP" },
        { label: "Operating Voltage", value: "230V AC / 50Hz" },
        { label: "Max Pressure", value: "360 mbar" },
        { label: "Certification", value: "CE / EN161" },
      ],
    },
    {
      name: "Solenoid Coil Replacement",
      slug: "solenoid-coil-replacement",
      itemCode: "SV-COIL",
      shortDesc: "Replacement coil for Brahma / SPEA solenoid valves, 230V.",
      description:
        "Universal replacement coil for Brahma BE6, EG12, E6G and SPEA gas solenoid valves. 230V AC, class H insulation. IP54 rated, suitable for outdoor/high-temp applications.",
      price: 2000,
      hsn: "84818030",
      taxRate: "GST@18%",
      stockQty: 30,
      unit: "PIECES",
      slug_img: "gas-solenoid-valve-1-2",
      specs: [
        { label: "Voltage", value: "230V AC / 50Hz" },
        { label: "Insulation Class", value: "Class H" },
        { label: "IP Rating", value: "IP54" },
        { label: "Compatible Valves", value: "Brahma BE6, EG12 / SPEA series" },
      ],
    },
    // SEQUENCE CONTROLLERS
    {
      name: "Sequence Controller (Burner Automatic Control)",
      slug: "sequence-controller",
      itemCode: "SEQ-CTRL",
      shortDesc: "Programmable burner sequence controller for automatic startup and safety monitoring.",
      description:
        "Electronic burner sequence controller for automatic management of ignition sequence, pre-purge, flame detection, and safety lockout. Compatible with most single-stage gas and oil burners. Replaces older electromechanical sequencers. LED status indicators for each stage of the startup sequence.",
      price: 4000,
      hsn: "84169000",
      taxRate: "GST@18%",
      stockQty: 25,
      unit: "PIECES",
      slug_img: "burner-control-box",
      specs: [
        { label: "Type", value: "Electronic Automatic Sequence" },
        { label: "Power Supply", value: "230V AC / 50Hz" },
        { label: "Pre-Purge Time", value: "30 seconds (adjustable)" },
        { label: "Safety Lockout", value: "Automatic on Flame Failure" },
        { label: "Fuel Compatibility", value: "Gas / Oil Burners" },
      ],
    },
    {
      name: "Siemens LME22 Sequence Controller",
      slug: "siemens-lme22-controller",
      itemCode: "SIEMENS-LME22",
      shortDesc: "Siemens LME22 automatic gas burner control unit for fully automatic systems.",
      description:
        "Genuine Siemens LME22 burner management unit for complete automatic gas burner control. Manages startup, flame detection, safety lockout and valve activation. Industry-standard controller used in FT-10, FT-15 and FT-25 burner systems. Socket-mounted for easy field replacement.",
      price: 7500,
      hsn: "84169000",
      taxRate: "GST@18%",
      stockQty: 8,
      unit: "PIECES",
      slug_img: "burner-control-box",
      specs: [
        { label: "Model", value: "Siemens LME22" },
        { label: "Power Supply", value: "230V AC / 50Hz" },
        { label: "Flame Detection", value: "UV / IR Photocell" },
        { label: "Safety Lockout", value: "Manual Reset" },
        { label: "Compatible Burners", value: "FT-10, FT-15, FT-25" },
        { label: "HSN Code", value: "84169000" },
      ],
    },
    {
      name: "RMG88 Siemens Gas RBL Sequence Control",
      slug: "rmg88-siemens-sequence",
      itemCode: "RMG88-SIEMENS",
      shortDesc: "Siemens RMG88 gas sequence control unit for advanced burner management.",
      description:
        "Siemens RMG88 is a high-spec programmable gas burner control unit for multi-stage combustion management systems. Suitable for FT-25 large-capacity burners and industrial boiler systems. Features extended diagnostic memory, bus communication capability (LON), and 5-year lockout memory.",
      price: 15000,
      hsn: "84169000",
      taxRate: "GST@18%",
      stockQty: 3,
      unit: "PIECES",
      slug_img: "burner-control-box",
      specs: [
        { label: "Model", value: "Siemens RMG88" },
        { label: "Power Supply", value: "230V AC / 50Hz" },
        { label: "Communication", value: "LON Bus" },
        { label: "Lockout Memory", value: "5 Years" },
        { label: "Suitable For", value: "FT-25, Large Boilers" },
        { label: "HSN Code", value: "84169000" },
      ],
    },
    // IGNITION / PHOTOCELL
    {
      name: "Ignition Electrode Set",
      slug: "ignition-electrode-set",
      itemCode: "ELEC-SET",
      shortDesc: "Dual ceramic spark electrode set for FlameTech gas and oil burners.",
      description:
        "High-temperature ceramic spark electrode set suitable for all FlameTech FT-3 to FT-15 burners and compatible Riello/Weishaupt burners. Glazed alumina ceramic insulator rated to 1300°C. Kanthal A-1 alloy electrode tip for long service life.",
      price: 800,
      hsn: "85118000",
      taxRate: "GST@18%",
      stockQty: 120,
      unit: "SET",
      slug_img: "ignition-electrode-set",
      specs: [
        { label: "Max Temperature", value: "1300 °C" },
        { label: "Electrode Material", value: "Kanthal A-1 Alloy" },
        { label: "Insulator Type", value: "Glazed Alumina Ceramic" },
        { label: "Insulator Length", value: "85 mm" },
        { label: "Compatible Burners", value: "FT-3, FT-5, FT-10, FT-15" },
      ],
    },
    {
      name: "Photocell Flame Sensor (Riello / Universal)",
      slug: "photocell-flame-sensor",
      itemCode: "PHOTOCELL",
      shortDesc: "Universal UV photocell flame scanner for Riello, Weishaupt and FlameTech burners.",
      description:
        "High-sensitivity UV photocell for automatic flame supervision in gas and oil burners. Detects flame presence in < 100ms. Comes with 1.5-meter silicone-jacketed high-temperature cable and bayonet-mount connector. Compatible with Brahma, LME22, and Siemens sequence controllers.",
      price: 1500,
      hsn: "90275000",
      taxRate: "GST@18%",
      stockQty: 60,
      unit: "PIECES",
      slug_img: "flame-sensor-photocell",
      specs: [
        { label: "Spectral Range", value: "190 – 270 nm (UV)" },
        { label: "Response Speed", value: "< 100 ms" },
        { label: "Cable Length", value: "1.5 m" },
        { label: "Cable Insulation", value: "Silicone 180°C" },
        { label: "Mounting", value: "Bayonet Lock" },
      ],
    },
    {
      name: "Ignition Transformer (Brahma)",
      slug: "ignition-transformer-brahma",
      itemCode: "TRANS-BRAHMA",
      shortDesc: "Brahma high-voltage ignition transformer for automatic burners.",
      description:
        "Brahma ignition transformer providing high-voltage spark for automatic ignition in gas and oil burners. Secondary output: 8kV / 20mA. Epoxy-sealed, vibration-resistant. Plug-in socket mounting for fast field replacement.",
      price: 1800,
      hsn: "84169000",
      taxRate: "GST@18%",
      stockQty: 25,
      unit: "PIECES",
      slug_img: "ignition-electrode-set",
      specs: [
        { label: "Brand", value: "Brahma" },
        { label: "Primary Voltage", value: "230V AC / 50Hz" },
        { label: "Secondary Voltage", value: "8 kV" },
        { label: "Output Current", value: "20 mA" },
        { label: "Mounting", value: "Plug-in Socket" },
        { label: "Enclosure", value: "Epoxy-Sealed" },
      ],
    },
    // TEMPERATURE CONTROLLERS
    {
      name: "Temperature Controller 5892 (Digital PID)",
      slug: "temperature-controller-5892",
      itemCode: "TEMP-CTRL-5892",
      shortDesc: "Digital PID temperature controller, 48x48mm DIN panel-mount.",
      description:
        "Digital PID temperature controller model 5892 (Selec / equivalent). Panel-mount 48x48mm DIN size. Universal input (K, J, T thermocouple or RTD PT100). PID auto-tune function for quick commissioning. Relay output for burner/heater control. Used in powder coating ovens, industrial baking ovens, and chemical reactors.",
      price: 2200,
      hsn: "9032",
      taxRate: "GST@18%",
      stockQty: 20,
      unit: "PIECES",
      slug_img: "oven-control-panel",
      specs: [
        { label: "Model", value: "5892 / PID Digital" },
        { label: "Input", value: "K / J / T Thermocouple, PT100 RTD" },
        { label: "Display", value: "Dual 4-digit LED" },
        { label: "Output", value: "Relay + SSR Drive" },
        { label: "Control Mode", value: "PID / On-Off" },
        { label: "Panel Size", value: "48 x 48 mm" },
      ],
    },
    {
      name: "Temperature Sensor K-Type MI 10x290mm",
      slug: "temp-sensor-k-type-10x290",
      itemCode: "SENSOR-K-10X290",
      shortDesc: "K-type mineral-insulated thermocouple sensor, 10mm x 290mm, high accuracy.",
      description:
        "Mineral-insulated (MI) K-type thermocouple temperature sensor with 10mm diameter, 290mm insertion length, and 1/2 inch NPT threaded fitting. Suitable for continuous use up to 1100°C in furnaces, ovens, and kilns. Stainless SS310 sheath for corrosion resistance.",
      price: 1500,
      hsn: "90259000",
      taxRate: "GST@18%",
      stockQty: 40,
      unit: "PIECES",
      slug_img: "flame-sensor-photocell",
      specs: [
        { label: "Type", value: "K-Type Thermocouple" },
        { label: "Construction", value: "Mineral Insulated (MI)" },
        { label: "Diameter", value: "10 mm" },
        { label: "Insertion Length", value: "290 mm" },
        { label: "Max Temperature", value: "1100 °C" },
        { label: "Sheath Material", value: "SS310 (1.4841)" },
        { label: "Fitting", value: "1/2 inch NPT" },
      ],
    },
    // BLOWERS / MOTORS
    {
      name: "Burner Blower Motor 135W (FT-5 Compatible)",
      slug: "burner-blower-motor-135w",
      itemCode: "MOTOR-135W",
      shortDesc: "135W single-phase burner blower motor for FT-5 and compatible burners.",
      description:
        "Replacement single-phase induction blower motor for FT-5 gas burners and compatible industrial burner systems. 135W, 2800 RPM, class B insulation. Includes capacitor and flange mount. Also compatible with 10-blade FT impeller fans.",
      price: 4700,
      hsn: "85012000",
      taxRate: "IGST@18%",
      stockQty: 10,
      unit: "PIECES",
      slug_img: "amc-service",
      specs: [
        { label: "Power", value: "135 W" },
        { label: "Speed", value: "2800 RPM" },
        { label: "Voltage", value: "230V / 1Ph / 50Hz" },
        { label: "Insulation Class", value: "Class B" },
        { label: "Mounting", value: "Flange Mount" },
        { label: "Compatible Burner", value: "FT-5, 135W Series" },
      ],
    },
    {
      name: "Impeller Fan for FT-5 Gas Burner",
      slug: "ft5-impeller-fan",
      itemCode: "FAN-FT5",
      shortDesc: "Replacement aluminum impeller fan blade for FT-5 gas burner blower.",
      description:
        "Precision-balanced die-cast aluminum impeller fan for FT-5 gas burner air supply blower. 10-blade design for optimum airflow and low noise. Pre-balanced for vibration-free operation. Replaces worn or damaged impellers causing air starvation and ignition failure.",
      price: 1050,
      hsn: "84145990",
      taxRate: "GST@18%",
      stockQty: 30,
      unit: "PIECES",
      slug_img: "amc-service",
      specs: [
        { label: "Material", value: "Die-Cast Aluminium" },
        { label: "Blade Count", value: "10 Blades" },
        { label: "Balance", value: "Pre-Balanced" },
        { label: "Compatible Motor", value: "135W FT-5 Burner" },
        { label: "Compatible Burner", value: "FT-5 Gas Burner" },
      ],
    },
    // GAS REGULATORS
    {
      name: "Vanaz Gas Pressure Regulator R-41091X",
      slug: "vanaz-regulator-r41091x",
      itemCode: "VANAZ-R41091X",
      shortDesc: "Vanaz LPG/CNG pressure regulator for industrial burner gas supply lines.",
      description:
        "High-quality Vanaz R-41091X pressure regulator for industrial LPG and CNG supply to burners. Reduces high-pressure cylinder supply to safe working pressure (20-100 mbar). Spring-loaded diaphragm design for constant downstream pressure regardless of supply variations. Brass body with die-cast housing.",
      price: 1500,
      hsn: "84818090",
      taxRate: "GST@18%",
      stockQty: 15,
      unit: "PIECES",
      slug_img: "gas-solenoid-valve-1-2",
      specs: [
        { label: "Brand", value: "Vanaz" },
        { label: "Model", value: "R-41091X" },
        { label: "Fuel", value: "LPG / CNG / Natural Gas" },
        { label: "Inlet Pressure", value: "Up to 4 bar" },
        { label: "Outlet Pressure", value: "20 – 100 mbar adjustable" },
        { label: "Connection", value: "1/2 inch BSP" },
        { label: "Body", value: "Brass / Die-Cast" },
      ],
    },
    // GAS PIPE FITTINGS
    {
      name: "TATA Class C Seamless MS Pipe 1/2\"",
      slug: "ms-pipe-half-inch",
      itemCode: "PIPE-TATA-1/2",
      shortDesc: "TATA Class C seamless mild steel gas pipe, 1/2 inch, priced per square feet.",
      description:
        "Heavy-duty TATA Class C seamless mild steel pipe for industrial gas piping installations. Used for LPG, natural gas, and compressed air supply lines to burners and process equipment. Available in standard lengths. Compliant with IS 1239 Part 1 standard.",
      price: 95,
      hsn: "73041100",
      taxRate: "GST@18%",
      stockQty: 500,
      unit: "SQUARE FEET",
      slug_img: "amc-service",
      specs: [
        { label: "Pipe Size", value: "1/2 inch (DN15)" },
        { label: "Standard", value: "IS 1239 Part 1, Class C" },
        { label: "Material", value: "Seamless Mild Steel" },
        { label: "Brand", value: "TATA Steel" },
        { label: "Application", value: "LPG / CNG / Air Piping" },
        { label: "Unit", value: "Per Square Feet" },
      ],
    },
  ];

  // ============================================================
  // 8. SERVICES
  // ============================================================
  const services = [
    {
      name: "FlameTech Professional AMC Contract (1 Year)",
      slug: "amc-service-contract",
      itemCode: "FT-SVC-AMC",
      shortDesc: "Annual Maintenance Contract: 6 bi-monthly visits, full safety check, combustion analysis.",
      description:
        "Our Annual Maintenance Contract ensures zero downtime for your industrial burner systems. Includes 6 scheduled preventive maintenance visits per year (every 60 days), combustion efficiency analysis, safety interlock calibration, nozzle and electrode replacement check, combustion head cleaning, and a written service report after each visit. Priority response within 24 hours for emergency callouts within our service area (Mumbai/MMR).",
      price: 4794,
      hsn: "998719",
      taxRate: "GST@18%",
      stockQty: 999,
      unit: "YEAR",
      slug_img: "amc-service",
      specs: [
        { label: "Visits Per Year", value: "6 (Every 60 Days)" },
        { label: "Services Included", value: "Combustion Analysis, Calibration, Cleaning" },
        { label: "Response SLA", value: "24 Hours (Mumbai / MMR)" },
        { label: "Written Report", value: "After Every Visit" },
        { label: "Coverage", value: "All FlameTech Burner Models" },
        { label: "Price Per Visit", value: "₹799 (ex. GST)" },
      ],
    },
    {
      name: "Burner Repair & Service Charge",
      slug: "burner-repair-service",
      itemCode: "FT-SVC-REPAIR",
      shortDesc: "Professional on-site or workshop burner repair and service.",
      description:
        "Expert diagnosis and repair of industrial gas and oil burners. Covers fault diagnosis, component replacement (electrodes, photocells, solenoid valves), combustion calibration, and performance testing after repair. Workshop or on-site service available. Spare parts charged separately.",
      price: 1500,
      hsn: "998732",
      taxRate: "GST@18%",
      stockQty: 999,
      unit: "PIECES",
      slug_img: "amc-service",
      specs: [
        { label: "Service Type", value: "On-site or Workshop" },
        { label: "Coverage", value: "All Gas & Oil Burner Types" },
        { label: "Includes", value: "Diagnosis, Calibration, Testing" },
        { label: "Spare Parts", value: "Charged Separately" },
        { label: "Warranty", value: "30 Days on Repaired Components" },
      ],
    },
    {
      name: "Burner Wiring & Panel Installation Service",
      slug: "burner-wiring-service",
      itemCode: "FT-SVC-WIRING",
      shortDesc: "Professional burner wiring, panel commissioning and safety interlock installation.",
      description:
        "Full-service wiring and commissioning for new burner installations or panel upgrades. Covers control panel to burner wiring harness, photocell wiring, solenoid valve connections, safety interlock wiring, and initial combustion test and startup. Ideal for new installations and panel replacements.",
      price: 3000,
      hsn: "998732",
      taxRate: "GST@18%",
      stockQty: 999,
      unit: "PIECES",
      slug_img: "amc-service",
      specs: [
        { label: "Includes", value: "Panel Wiring, Burner Connections, Commissioning" },
        { label: "Safety Interlocks", value: "Installed and Tested" },
        { label: "Initial Start", value: "Combustion Test + Calibration" },
        { label: "Duration", value: "Half-day to Full-day (site-dependent)" },
      ],
    },
  ];

  // Now insert all products
  const industryMap: Record<string, string> = {
    metal: metalIndustry.id,
    chemical: chemicalIndustry.id,
    bakery: bakeryIndustry.id,
    textile: textileIndustry.id,
    ceramics: ceramicsIndustry.id,
    hospitality: hospitalityIndustry.id,
  };

  // Track slugs to avoid duplicates
  const usedSlugs = new Set<string>();

  function uniqueSlug(base: string): string {
    let s = base;
    let n = 1;
    while (usedSlugs.has(s)) {
      s = `${base}-${n++}`;
    }
    usedSlugs.add(s);
    return s;
  }

  console.log("Inserting gas burners...");
  for (const b of gasBurners) {
    const slug = uniqueSlug(b.slug);
    const imgSlug = (b as any).slug_img || slug;
    const industryIds = ((b as any).industries || []).map((k: string) => ({ id: industryMap[k] })).filter((x: {id: string}) => x.id);
    await prisma.product.create({
      data: {
        name: b.name,
        slug,
        itemCode: b.itemCode,
        type: b.hsn === "84162000" ? ProductType.EQUIPMENT : ProductType.EQUIPMENT,
        categoryId: b.slug.includes("ftd") || b.slug.includes("ldo") || b.slug.includes("diesel") || b.slug.includes("oil")
          ? oilBurnersCategory.id
          : gasBurnersCategory.id,
        shortDesc: b.shortDesc,
        description: b.description,
        price: b.price ?? null,
        hsn: b.hsn,
        taxRate: b.taxRate,
        stockQty: b.stockQty,
        unit: b.unit,
        isActive: true,
        datasheetUrl: `/datasheets/${slug}-spec.pdf`,
        images: { create: [{ url: `/images/${imgSlug}.jpg`, altText: b.name, position: 0 }] },
        image: `/images/${imgSlug}.jpg`,
        specs: { create: b.specs },
        industries: industryIds.length ? { connect: industryIds } : undefined,
      },
    });
  }

  console.log("Inserting control panels...");
  for (const p of controlPanels) {
    const slug = uniqueSlug(p.slug);
    const imgSlug = (p as any).slug_img || slug;
    await prisma.product.create({
      data: {
        name: p.name,
        slug,
        itemCode: p.itemCode,
        type: ProductType.EQUIPMENT,
        categoryId: controlPanelsCategory.id,
        shortDesc: p.shortDesc,
        description: p.description,
        price: p.price ?? null,
        hsn: p.hsn,
        taxRate: p.taxRate,
        stockQty: p.stockQty,
        unit: p.unit,
        isActive: true,
        images: { create: [{ url: `/images/${imgSlug}.jpg`, altText: p.name, position: 0 }] },
        image: `/images/${imgSlug}.jpg`,
        specs: { create: p.specs },
      },
    });
  }

  console.log("Inserting spare parts...");
  for (const part of spareParts) {
    const slug = uniqueSlug(part.slug);
    const imgSlug = (part as any).slug_img || slug;
    await prisma.product.create({
      data: {
        name: part.name,
        slug,
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
        images: { create: [{ url: `/images/${imgSlug}.jpg`, altText: part.name, position: 0 }] },
        image: `/images/${imgSlug}.jpg`,
        specs: { create: part.specs },
      },
    });
  }

  console.log("Inserting services...");
  for (const svc of services) {
    const slug = uniqueSlug(svc.slug);
    const imgSlug = (svc as any).slug_img || slug;
    await prisma.product.create({
      data: {
        name: svc.name,
        slug,
        itemCode: svc.itemCode,
        type: ProductType.SERVICE,
        categoryId: servicesCategory.id,
        shortDesc: svc.shortDesc,
        description: svc.description,
        price: svc.price,
        hsn: svc.hsn,
        taxRate: svc.taxRate,
        stockQty: svc.stockQty,
        unit: svc.unit,
        isActive: true,
        images: { create: [{ url: `/images/${imgSlug}.jpg`, altText: svc.name, position: 0 }] },
        image: `/images/${imgSlug}.jpg`,
        specs: { create: svc.specs },
      },
    });
  }

  console.log("\n============================");
  console.log("Database seeding completed!");
  const total = await prisma.product.count();
  const cats = await prisma.category.count();
  console.log(`Total Products: ${total}`);
  console.log(`Total Categories: ${cats}`);
  console.log("============================\n");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
