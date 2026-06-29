import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { cardSchema } from "@/lib/validation";
import { z } from "zod";

export const dynamic = "force-dynamic";

// GET /api/cards/[slug] -> single card (admin only)
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }
  return NextResponse.json({ card });
}

// PATCH /api/cards/[slug] -> update (admin only).
// Accepts a full card payload, OR a partial { isActive } toggle.
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await prisma.card.findUnique({
    where: { slug: params.slug },
  });
  if (!existing) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);

  // Quick toggle path: { isActive: boolean } only
  const toggle = z.object({ isActive: z.boolean() }).safeParse(body);
  const isToggleOnly =
    body && Object.keys(body).length === 1 && "isActive" in body;

  if (isToggleOnly && toggle.success) {
    const card = await prisma.card.update({
      where: { slug: params.slug },
      data: { isActive: toggle.data.isActive },
    });
    return NextResponse.json({ card });
  }

  // Full update
  const parsed = cardSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const card = await prisma.card.update({
      where: { slug: params.slug },
      data: parsed.data,
    });
    return NextResponse.json({ card });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That slug is already in use. Please choose another." },
        { status: 409 }
      );
    }
    console.error("Update card error:", err);
    return NextResponse.json(
      { error: "Failed to update card." },
      { status: 500 }
    );
  }
}

// DELETE /api/cards/[slug] -> delete (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.card.delete({ where: { slug: params.slug } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }
    console.error("Delete card error:", err);
    return NextResponse.json(
      { error: "Failed to delete card." },
      { status: 500 }
    );
  }
}
