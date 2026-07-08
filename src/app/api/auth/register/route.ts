import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ error: "Name, email, phone, and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing?.passwordHash) {
      return NextResponse.json({ error: "An account with this email already exists. Try signing in instead." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = existing
      // Upgrade a passwordless guest-checkout record into a real account
      ? await prisma.user.update({
          where: { id: existing.id },
          data: { name, phone, company, passwordHash },
        })
      : await prisma.user.create({
          data: { name, email, phone, company, passwordHash, role: "CUSTOMER" },
        });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }
}
