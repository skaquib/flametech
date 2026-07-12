import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function requireAdmin(req: any) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  return isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN");
}

export const GET = auth(async function GET(req) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const sessions = await prisma.marketingChatSession.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { messages: true } },
    },
    take: 100,
  });

  return NextResponse.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s._count.messages,
    })),
  });
}) as any;

export const POST = auth(async function POST(req) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const session = await prisma.marketingChatSession.create({ data: {} });
  return NextResponse.json({ id: session.id });
}) as any;
