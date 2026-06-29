import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { cardSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

// GET /api/cards?q=search  -> list cards (admin only)
export async function GET(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q")?.trim();

  const where: Prisma.CardWhereInput = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { position: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const cards = await prisma.card.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ cards });
}

// POST /api/cards  -> create a card (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = cardSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({ data: parsed.data });
    return NextResponse.json({ card }, { status: 201 });
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
    console.error("Create card error:", err);
    return NextResponse.json(
      { error: "Failed to create card." },
      { status: 500 }
    );
  }
}
