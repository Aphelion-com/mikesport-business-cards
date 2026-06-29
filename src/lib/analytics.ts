import type { Card, CardEvent, CardEventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CardStatCounts = {
  views: number;
  saves: number;
  qrDownloads: number;
  copies: number;
  previews: number;
};

export type CardWithStats = Card & { stats: CardStatCounts };

const emptyCounts = (): CardStatCounts => ({
  views: 0,
  saves: 0,
  qrDownloads: 0,
  copies: 0,
  previews: 0,
});

function applyCount(
  counts: CardStatCounts,
  type: CardEventType,
  n: number
): void {
  switch (type) {
    case "PAGE_VIEW":
      counts.views += n;
      break;
    case "SAVE_CONTACT":
      counts.saves += n;
      break;
    case "QR_DOWNLOAD":
      counts.qrDownloads += n;
      break;
    case "COPY_URL":
      counts.copies += n;
      break;
    case "PREVIEW_OPEN":
      counts.previews += n;
      break;
  }
}

/** Counts of each event type grouped by card. */
async function getCountsByCard(): Promise<Map<string, CardStatCounts>> {
  const grouped = await prisma.cardEvent.groupBy({
    by: ["cardId", "type"],
    _count: { _all: true },
  });

  const map = new Map<string, CardStatCounts>();
  for (const row of grouped) {
    const counts = map.get(row.cardId) ?? emptyCounts();
    applyCount(counts, row.type, row._count._all);
    map.set(row.cardId, counts);
  }
  return map;
}

/** High-level totals for the overview dashboard. */
export async function getOverview() {
  const [totalCards, activeCards, totalViews, totalSaves] = await Promise.all([
    prisma.card.count(),
    prisma.card.count({ where: { isActive: true } }),
    prisma.cardEvent.count({ where: { type: "PAGE_VIEW" } }),
    prisma.cardEvent.count({ where: { type: "SAVE_CONTACT" } }),
  ]);

  return {
    totalCards,
    activeCards,
    inactiveCards: totalCards - activeCards,
    totalViews,
    totalSaves,
  };
}

/** All cards (optionally filtered) with their event stats merged in. */
export async function getCardsWithStats(q?: string): Promise<CardWithStats[]> {
  const where: Prisma.CardWhereInput = q
    ? {
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { position: { contains: q, mode: "insensitive" } },
        ],
      }
    : {};

  const [cards, countsByCard] = await Promise.all([
    prisma.card.findMany({ where, orderBy: { createdAt: "desc" } }),
    getCountsByCard(),
  ]);

  return cards.map((card) => ({
    ...card,
    stats: countsByCard.get(card.id) ?? emptyCounts(),
  }));
}

/** Top cards by page views. */
export async function getMostViewed(limit = 5): Promise<CardWithStats[]> {
  const all = await getCardsWithStats();
  return [...all]
    .sort((a, b) => b.stats.views - a.stats.views)
    .slice(0, limit)
    .filter((c) => c.stats.views > 0 || all.length <= limit);
}

export type RecentEvent = CardEvent & { card: Pick<Card, "fullName" | "slug"> };

/** Most recent events across all cards, with card name. */
export async function getRecentActivity(limit = 12): Promise<RecentEvent[]> {
  return prisma.cardEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { card: { select: { fullName: true, slug: true } } },
  });
}

/** Stats + recent events for a single card. */
export async function getCardStats(cardId: string) {
  const [grouped, recent] = await Promise.all([
    prisma.cardEvent.groupBy({
      by: ["type"],
      where: { cardId },
      _count: { _all: true },
    }),
    prisma.cardEvent.findMany({
      where: { cardId },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
  ]);

  const counts = emptyCounts();
  for (const row of grouped) {
    applyCount(counts, row.type, row._count._all);
  }

  return { counts, recent };
}
