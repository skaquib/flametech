import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

function requireAdmin(req: any) {
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  return isLoggedIn && (role === "ADMIN" || role === "SUPER_ADMIN");
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const GET = auth(async function GET(req, ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const { id } = await (ctx as unknown as RouteParams).params;

  const session = await prisma.marketingChatSession.findUnique({
    where: { id },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) {
    return NextResponse.json({ error: "Chat not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: session.id,
    title: session.title,
    messages: session.messages.map((m) => ({ role: m.role, content: m.content, imageUrl: m.imageUrl })),
  });
}) as any;

export const DELETE = auth(async function DELETE(req, ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const { id } = await (ctx as unknown as RouteParams).params;

  await prisma.marketingChatSession.delete({ where: { id } }).catch(() => null);

  return NextResponse.json({ ok: true });
}) as any;
