import prisma from "@/lib/prisma";

const FOLLOW_UP_DAYS = 30;
const CLOSED_STATUSES = new Set(["CONVERTED", "CLOSED"]);
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface LeadWithFollowUp {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string | null;
  productName: string;
  status: string;
  daysSinceContact: number;
  dueForFollowUp: boolean;
}

export async function getLeadsWithFollowUpStatus(): Promise<LeadWithFollowUp[]> {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      include: { product: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    const now = Date.now();
    return quotes
      .map((q) => {
        const reference = q.lastContactedAt ?? q.createdAt;
        const daysSinceContact = Math.floor((now - reference.getTime()) / MS_PER_DAY);
        const dueForFollowUp = !CLOSED_STATUSES.has(q.status) && daysSinceContact >= FOLLOW_UP_DAYS;
        return {
          id: q.id,
          name: q.name,
          company: q.company,
          phone: q.phone,
          email: q.email,
          productName: q.product?.name ?? "Unknown product",
          status: q.status,
          daysSinceContact,
          dueForFollowUp,
        };
      })
      .sort((a, b) => b.daysSinceContact - a.daysSinceContact);
  } catch {
    return [];
  }
}
