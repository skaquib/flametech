import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const CONTENT_TYPE_INSTRUCTIONS: Record<string, string> = {
  whatsapp: "Write a short WhatsApp broadcast message (under 300 characters, plain text, no markdown, can use simple emojis sparingly). It should read naturally on WhatsApp and end with a clear call to action.",
  ad: "Write a short digital ad headline (under 40 characters) plus one-line ad body copy (under 90 characters), suitable for Google/Meta ads targeting B2B industrial buyers.",
  social: "Write a LinkedIn/social media caption (2-4 sentences, professional but engaging tone, can include 2-3 relevant hashtags at the end).",
  description: "Write a persuasive product description paragraph (80-120 words) suitable for the website, emphasizing technical credibility and business value for B2B industrial buyers.",
};

export const POST = auth(async function POST(req) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "AI copy generator is not configured (missing GEMINI_API_KEY)." }, { status: 500 });
  }

  try {
    const body = await (req as unknown as NextRequest).json();
    const { productName, productDetails, contentType, extraInstructions } = body;

    if (!productName || !contentType) {
      return NextResponse.json({ error: "productName and contentType are required." }, { status: 400 });
    }

    const instruction = CONTENT_TYPE_INSTRUCTIONS[contentType];
    if (!instruction) {
      return NextResponse.json({ error: "Unknown contentType." }, { status: 400 });
    }

    const prompt = `You are a marketing copywriter for FlameTech Engineering, an industrial gas/oil burner and spare-parts manufacturer based in Mumbai, India, serving B2B customers (bakeries, powder coating, chemical, ceramics, textile industries).

Product/topic: ${productName}
${productDetails ? `Details: ${productDetails}` : ""}
${extraInstructions ? `Additional instructions: ${extraInstructions}` : ""}

Task: ${instruction}

Return ONLY the requested copy text, no preamble, no explanation, no quotation marks around it.`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 502 });
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return NextResponse.json({ error: "AI returned no content. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Marketing copy generation error:", error);
    return NextResponse.json({ error: "Could not generate copy. Please try again." }, { status: 500 });
  }
}) as any;
