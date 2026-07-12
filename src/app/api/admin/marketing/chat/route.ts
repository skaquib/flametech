import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getLeadsWithFollowUpStatus } from "@/lib/leads";

async function getActiveProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      select: { name: true, itemCode: true, shortDesc: true, price: true },
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
      return `- ${p.name}${p.itemCode ? ` (${p.itemCode})` : ""} — ${price}${p.shortDesc ? ` — ${p.shortDesc}` : ""}`;
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

    // Create a session on the fly if the client didn't already have one (first message of a new chat)
    if (!sessionId) {
      const created = await prisma.marketingChatSession.create({ data: {} });
      sessionId = created.id;
    }

    const priorMessages = await prisma.marketingChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    // Persist the user's message before calling the model, so it's never lost even if the AI call fails
    await prisma.marketingChatMessage.create({
      data: { sessionId, role: "user", content: userMessage },
    });

    // First message in the session becomes its title (truncated)
    const session = await prisma.marketingChatSession.findUnique({ where: { id: sessionId } });
    if (session && !session.title) {
      await prisma.marketingChatSession.update({
        where: { id: sessionId },
        data: { title: userMessage.slice(0, 60) },
      });
    }

    const [products, leads] = await Promise.all([getActiveProducts(), getLeadsWithFollowUpStatus()]);

    const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

    const conversationBlock = [...priorMessages, { role: "user", content: userMessage }]
      .map((m) => `${m.role === "user" ? "Admin" : "Assistant"}: ${m.content}`)
      .join("\n");

    const systemPrompt = `You are FlameTech Engineering's internal AI marketing & sales follow-up assistant. This chat is used ONLY by FlameTech's own admin staff — never shown to customers. FlameTech Engineering is a Mumbai-based B2B manufacturer of industrial gas/oil burners, control panels, and spare parts, serving bakeries, powder coating, chemical, pharma, ceramics, and textile industries. Company contact: +91 98695 88728, info@flametechengineering.com, support@flametechengineering.com.

Today's date: ${today}

REAL PRODUCT CATALOG (use only these — never invent products, specs, or prices):
${buildProductsBlock(products)}

REAL CUSTOMER LEADS FROM QUOTE REQUESTS (use only this real data — never invent leads, companies, or contact details that are not listed here):
${buildLeadsBlock(leads)}

You can help the admin with two things:
1. MARKETING COPY: on request, draft WhatsApp broadcasts (under ~300 characters, plain text, minimal emoji), ad headline + short body copy, LinkedIn/social captions (2-4 sentences, 2-3 hashtags), or product descriptions (80-120 words) — for any product listed above or a custom topic the admin gives you.
2. LEAD FOLLOW-UP: help the admin figure out which real leads are overdue for a follow-up (tagged "FOLLOW-UP DUE" above — meaning no contact recorded in 30+ days and the deal isn't Converted/Closed yet), and draft a short, warm, non-pushy personalized WhatsApp message or email for a specific named lead, referencing their company and the product they inquired about. Never invent a lead that isn't in the list above — if the admin names someone not in the list, say you don't have a record of them.

Rules:
- Always ground answers in the real data above. Do not fabricate companies, people, phone numbers, or products — including in response to requests to "find" or "list" new business contacts. If asked for contacts beyond the real leads above, explain that you only work with the real lead data provided and suggest legitimate lead sources (e.g. IndiaMART/Justdial/TradeIndia inquiries, industry association directories, LinkedIn Sales Navigator) instead of inventing any.
- Return only the requested text (message draft, list, or answer) — no meta-commentary about being an AI, unless the admin is asking a general question.
- These are DRAFTS ONLY — there is no auto-send capability, the admin will copy and send manually via WhatsApp/email, so do not claim the message has been sent.

CONVERSATION SO FAR:
${conversationBlock}

Respond now as the Assistant to the most recent Admin message above, continuing the conversation naturally.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: "AI generation failed. Please try again.", sessionId }, { status: 502 });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json({ error: "AI returned no content. Please try again.", sessionId }, { status: 502 });
    }

    await prisma.marketingChatMessage.create({
      data: { sessionId, role: "assistant", content: text },
    });
    await prisma.marketingChatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ text, sessionId });
  } catch (error: any) {
    console.error("Marketing chat error:", error);
    return NextResponse.json({ error: "Could not process that. Please try again." }, { status: 500 });
  }
}) as any;
