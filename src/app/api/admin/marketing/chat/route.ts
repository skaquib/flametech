import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getLeadsWithFollowUpStatus } from "@/lib/leads";
import { uploadImageBuffer } from "@/lib/supabaseStorage";

const GEMINI_TEXT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_IMAGE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";
const VALID_CATEGORY_SLUGS = ["gas-burners", "oil-burners", "control-panels", "spare-parts"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function getActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      select: { name: true, slug: true, itemCode: true, shortDesc: true, price: true, type: true },
      orderBy: { name: "asc" },
      take: 100,
    });
  } catch {
    return [];
  }
}

function buildProductsBlock(products: Awaited<ReturnType<typeof getActiveProducts>>) {
  if (products.length === 0) return "(No product catalog data available right now.)";
  return products
    .map((p) => {
      const price = p.price ? `₹${p.price.toLocaleString("en-IN")} + GST` : "Quote only";
      return `- ${p.name} [slug: ${p.slug}]${p.itemCode ? ` (${p.itemCode})` : ""} — ${p.type} — ${price}${p.shortDesc ? ` — ${p.shortDesc}` : ""}`;
    })
    .join("\n");
}

function buildLeadsBlock(leads: Awaited<ReturnType<typeof getLeadsWithFollowUpStatus>>) {
  if (leads.length === 0) return "(No quote-request leads in the database yet.)";
  return leads
    .slice(0, 80)
    .map((l) => {
      const followUpTag = l.dueForFollowUp ? "FOLLOW-UP DUE" : "ok";
      return `- id:${l.id} | ${l.name}${l.company ? ` (${l.company})` : ""} | phone: ${l.phone}${l.email ? ` | email: ${l.email}` : ""} | interested in: ${l.productName} | status: ${l.status} | last contact: ${l.daysSinceContact} day(s) ago | ${followUpTag}`;
    })
    .join("\n");
}

async function findProductByIdentifier(identifier: string) {
  const bySlug = await prisma.product.findUnique({ where: { slug: identifier } });
  if (bySlug) return { product: bySlug };

  const matches = await prisma.product.findMany({
    where: { name: { contains: identifier, mode: "insensitive" } },
  });
  if (matches.length === 1) return { product: matches[0] };
  if (matches.length === 0) return { error: `No product found matching "${identifier}".` };
  return {
    error: `Multiple products match "${identifier}": ${matches.map((m) => `${m.name} [${m.slug}]`).join(", ")}. Ask the admin which one they mean.`,
  };
}

async function execCreateProduct(args: any) {
  if (!VALID_CATEGORY_SLUGS.includes(args.categorySlug)) {
    return { success: false, error: `categorySlug must be one of: ${VALID_CATEGORY_SLUGS.join(", ")}` };
  }
  const category = await prisma.category.findUnique({ where: { slug: args.categorySlug } });
  if (!category) return { success: false, error: `Category "${args.categorySlug}" doesn't exist in the database.` };

  const slug = slugify(args.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { success: false, error: `A product with slug "${slug}" already exists. Use update_product instead.` };

  const specs = Array.isArray(args.specs) ? args.specs : [];

  const product = await prisma.product.create({
    data: {
      name: args.name,
      slug,
      itemCode: args.itemCode || null,
      type: args.type,
      categoryId: category.id,
      shortDesc: args.shortDesc || null,
      description: args.description || null,
      price: args.type === "EQUIPMENT" ? null : args.price ?? null,
      stockQty: args.type === "EQUIPMENT" ? 0 : args.stockQty ?? 0,
      unit: args.unit || "SET",
      specs: { create: specs.map((s: any) => ({ label: s.label, value: s.value })) },
    },
  });

  return { success: true, id: product.id, slug: product.slug, name: product.name };
}

async function execUpdateProduct(args: any) {
  const { product, error } = await findProductByIdentifier(args.identifier);
  if (error || !product) return { success: false, error };

  const data: Record<string, unknown> = {};
  if (args.name !== undefined) data.name = args.name;
  if (args.shortDesc !== undefined) data.shortDesc = args.shortDesc;
  if (args.description !== undefined) data.description = args.description;
  if (args.price !== undefined) data.price = args.price;
  if (args.stockQty !== undefined) data.stockQty = args.stockQty;
  if (args.unit !== undefined) data.unit = args.unit;
  if (args.itemCode !== undefined) data.itemCode = args.itemCode;
  if (args.isActive !== undefined) data.isActive = args.isActive;

  const updated = await prisma.product.update({ where: { id: product.id }, data });
  return { success: true, id: updated.id, slug: updated.slug, name: updated.name };
}

async function execGenerateProductImage(args: any) {
  const { product, error } = await findProductByIdentifier(args.identifier);
  if (error || !product) return { success: false, error };

  if (!process.env.GEMINI_API_KEY) {
    return { success: false, error: "AI assistant is not configured (missing GEMINI_API_KEY)." };
  }

  const imageRes = await fetch(`${GEMINI_IMAGE_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Professional product photo, clean white studio background, industrial equipment photography style: ${args.prompt}`,
            },
          ],
        },
      ],
    }),
  });

  if (!imageRes.ok) {
    const errText = await imageRes.text();
    console.error("Gemini image generation error:", errText);
    if (imageRes.status === 429) {
      return {
        success: false,
        error: "AI image generation isn't available yet — this Google AI project has no billing/quota enabled for image models. Enable billing on the Google AI Studio project to use this.",
      };
    }
    return { success: false, error: "Image generation failed. Please try again." };
  }

  const imageData = await imageRes.json();
  const parts = imageData?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find((p: any) => p.inlineData);
  if (!imagePart) {
    return { success: false, error: "The AI didn't return an image for that prompt. Try rephrasing it." };
  }

  const mimeType = imagePart.inlineData.mimeType || "image/png";
  const extension = mimeType.split("/")[1] || "png";
  const buffer = Buffer.from(imagePart.inlineData.data, "base64");

  let hostedUrl: string;
  try {
    hostedUrl = await uploadImageBuffer(buffer, mimeType, extension);
  } catch (uploadErr: any) {
    console.error("Image storage upload failed:", uploadErr);
    return { success: false, error: "Image was generated but couldn't be saved to storage. Please try again." };
  }

  const existingCount = await prisma.productImage.count({ where: { productId: product.id } });
  await prisma.productImage.create({
    data: { productId: product.id, url: hostedUrl, altText: product.name, position: existingCount },
  });
  if (existingCount === 0) {
    await prisma.product.update({ where: { id: product.id }, data: { image: hostedUrl } });
  }

  return { success: true, slug: product.slug, name: product.name, imageGenerated: true, imageUrl: hostedUrl };
}

const tools = [
  {
    functionDeclarations: [
      {
        name: "create_product",
        description:
          "Create a new product in the FlameTech catalog. EQUIPMENT items (burners, panels) are quote-only — never set a price for them. PART/SERVICE items need a price and stock quantity.",
        parameters: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING", description: "Full product name, e.g. 'FlameTech FT-30 Gas Burner'" },
            type: { type: "STRING", enum: ["EQUIPMENT", "PART", "SERVICE"] },
            categorySlug: { type: "STRING", enum: VALID_CATEGORY_SLUGS },
            itemCode: { type: "STRING", description: "SKU / item code, optional" },
            shortDesc: { type: "STRING", description: "One-line tagline shown in listings" },
            description: { type: "STRING", description: "Longer paragraph description for the product page" },
            price: { type: "NUMBER", description: "Price in INR — omit for EQUIPMENT" },
            stockQty: { type: "NUMBER", description: "Stock quantity — for PART/SERVICE only" },
            unit: { type: "STRING", description: "Sales unit, e.g. PIECES, SET" },
            specs: {
              type: "ARRAY",
              description: "Technical specification rows",
              items: {
                type: "OBJECT",
                properties: { label: { type: "STRING" }, value: { type: "STRING" } },
                required: ["label", "value"],
              },
            },
          },
          required: ["name", "type", "categorySlug"],
        },
      },
      {
        name: "update_product",
        description:
          "Update an existing catalog product. Identify it by its exact name or slug from the catalog list. If the identifier is ambiguous or not found, this fails — ask the admin to clarify instead of guessing.",
        parameters: {
          type: "OBJECT",
          properties: {
            identifier: { type: "STRING", description: "The product's current name or slug" },
            name: { type: "STRING" },
            shortDesc: { type: "STRING" },
            description: { type: "STRING" },
            price: { type: "NUMBER" },
            stockQty: { type: "NUMBER" },
            unit: { type: "STRING" },
            itemCode: { type: "STRING" },
            isActive: { type: "BOOLEAN" },
          },
          required: ["identifier"],
        },
      },
      {
        name: "generate_product_image",
        description:
          "Generate a product photo with AI and attach it to a product's image gallery (becomes the cover image if it has none yet).",
        parameters: {
          type: "OBJECT",
          properties: {
            identifier: { type: "STRING", description: "The product's exact name or slug from the catalog" },
            prompt: { type: "STRING", description: "Description of the product image to generate" },
          },
          required: ["identifier", "prompt"],
        },
      },
    ],
  },
];

function requireAdmin(req: any) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  return isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN");
}

export const POST = auth(async function POST(req) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI assistant is not configured (missing GEMINI_API_KEY)." }, { status: 500 });
  }

  try {
    const body = await (req as unknown as NextRequest).json();
    const userMessage: string = typeof body?.message === "string" ? body.message.trim() : "";
    let sessionId: string | undefined = typeof body?.sessionId === "string" ? body.sessionId : undefined;

    if (!userMessage) {
      return NextResponse.json({ error: "message is required." }, { status: 400 });
    }

    if (!sessionId) {
      const created = await prisma.marketingChatSession.create({ data: {} });
      sessionId = created.id;
    }

    const priorMessages = await prisma.marketingChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    await prisma.marketingChatMessage.create({ data: { sessionId, role: "user", content: userMessage } });

    const session = await prisma.marketingChatSession.findUnique({ where: { id: sessionId } });
    if (session && !session.title) {
      await prisma.marketingChatSession.update({
        where: { id: sessionId },
        data: { title: userMessage.slice(0, 60) },
      });
    }

    const [products, leads] = await Promise.all([getActiveProducts(), getLeadsWithFollowUpStatus()]);
    const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

    const systemPrompt = `You are FlameTech Engineering's internal AI marketing, catalog, and sales follow-up assistant. This chat is used ONLY by FlameTech's own admin staff — never shown to customers. FlameTech Engineering is a Mumbai-based B2B manufacturer of industrial gas/oil burners, control panels, and spare parts, serving bakeries, powder coating, chemical, pharma, ceramics, and textile industries. Company contact: +91 98695 88728, info@flametechengineering.com, support@flametechengineering.com.

Today's date: ${today}

REAL PRODUCT CATALOG (showing up to 100 of ${products.length} active products, alphabetically — this list is for grounding marketing-copy discussion only, it is NOT the full catalog):
${buildProductsBlock(products)}

REAL CUSTOMER LEADS FROM QUOTE REQUESTS (use only this real data — never invent leads, companies, or contact details that are not listed here):
${buildLeadsBlock(leads)}

You can help the admin with:
1. MARKETING COPY: draft WhatsApp broadcasts, ad headline + copy, LinkedIn/social captions, or product descriptions for any product above or a custom topic.
2. LEAD FOLLOW-UP: identify real leads overdue for a follow-up (tagged "FOLLOW-UP DUE" above), and draft a short personalized WhatsApp/email message for a specific named lead. Never invent a lead not in the list.
3. CATALOG MANAGEMENT: use your tools to actually create a new product, update an existing one, or generate and attach a product image — when the admin asks you to. The update_product and generate_product_image tools always perform a live, authoritative database lookup by name/slug — ALWAYS attempt the tool call with the admin's exact wording as the identifier, even if that product isn't shown in the (truncated) catalog list above. The tool itself will report back if the product truly doesn't exist or is ambiguous — only tell the admin a product "doesn't exist" after the tool call actually fails, never assume that from the list above. Confirm the details back in plain language after a tool call succeeds; if it fails, explain the error and ask a clarifying question.

Rules:
- Ground marketing/lead answers in the real data above. Do not fabricate companies, people, phone numbers, or leads.
- Catalog changes (create/update/generate image) are real database writes — only call those tools when the admin has actually asked for that action, not while just discussing ideas.
- These marketing drafts are for the admin to review and send manually — there is no auto-send capability.
- Keep responses concise and plain text (no markdown formatting).`;

    const contents = [
      ...priorMessages.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    let finalText: string | null = null;
    let generatedImageUrl: string | null = null;
    const MAX_TOOL_HOPS = 4;

    for (let hop = 0; hop < MAX_TOOL_HOPS; hop++) {
      const geminiRes = await fetch(`${GEMINI_TEXT_URL}?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          tools,
        }),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        console.error("Gemini API error:", errText);
        return NextResponse.json({ error: "AI generation failed. Please try again.", sessionId }, { status: 502 });
      }

      const data = await geminiRes.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const functionCallPart = parts.find((p: any) => p.functionCall);

      if (!functionCallPart) {
        finalText = parts
          .map((p: any) => p.text)
          .filter(Boolean)
          .join("\n")
          .trim();
        break;
      }

      const { name, args } = functionCallPart.functionCall;
      let result: any;
      if (name === "create_product") result = await execCreateProduct(args);
      else if (name === "update_product") result = await execUpdateProduct(args);
      else if (name === "generate_product_image") {
        result = await execGenerateProductImage(args);
        if (result?.imageUrl) {
          generatedImageUrl = result.imageUrl;
        }
      } else {
        result = { success: false, error: `Unknown tool "${name}".` };
      }

      contents.push({ role: "model", parts: [{ functionCall: { name, args } }] } as any);
      contents.push({ role: "user", parts: [{ functionResponse: { name, response: result } }] } as any);
    }

    if (!finalText) {
      finalText = "I've made the requested changes, but couldn't confirm in words — please check the catalog to verify.";
    }

    await prisma.marketingChatMessage.create({
      data: { sessionId, role: "assistant", content: finalText, imageUrl: generatedImageUrl },
    });
    await prisma.marketingChatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });

    return NextResponse.json({ text: finalText, sessionId, imageUrl: generatedImageUrl });
  } catch (error: any) {
    console.error("Marketing chat error:", error);
    return NextResponse.json({ error: "Could not process that. Please try again." }, { status: 500 });
  }
}) as any;
