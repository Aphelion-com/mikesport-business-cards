import { NextRequest, NextResponse } from "next/server";
import { CardEventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED: CardEventType[] = [
  "PAGE_VIEW",
  "SAVE_CONTACT",
  "QR_DOWNLOAD",
  "COPY_URL",
  "PREVIEW_OPEN",
];

/**
 * Record a card analytics event. Public endpoint (PAGE_VIEW / SAVE_CONTACT come
 * from the public page). Tracking must never break the user's main action, so
 * this endpoint is defensive and always returns quickly with JSON.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const slug = typeof body?.slug === "string" ? body.slug : "";
    const type = body?.type as CardEventType | undefined;

    if (!slug || !type || !ALLOWED.includes(type)) {
      return NextResponse.json(
        { ok: false, error: "Invalid event payload" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { slug },
      select: { id: true },
    });

    // Silently ignore unknown cards — don't leak existence, don't error.
    if (!card) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = req.headers.get("user-agent")?.slice(0, 500) ?? null;
    const referrer = req.headers.get("referer")?.slice(0, 500) ?? null;

    await prisma.cardEvent.create({
      data: { cardId: card.id, type, userAgent, referrer },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never surface tracking failures to the client as an error.
    console.error("Event tracking error:", err);
    return NextResponse.json({ ok: true });
  }
}
