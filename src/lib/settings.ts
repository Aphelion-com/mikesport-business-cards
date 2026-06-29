import type { AppSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const SETTINGS_ID = "singleton";

export const DEFAULT_SETTINGS = {
  id: SETTINGS_ID,
  logoUrl: null as string | null,
  faviconUrl: null as string | null,
  dashboardTitle: "Mike Sport Cards",
  accentColor: "#F1582B",
  companyWebsite: null as string | null,
  defaultAddress: null as string | null,
  defaultCompanyPhone: null as string | null,
  cardEmblemUrl: null as string | null,
  showEmblemOnCards: true,
  emblemPosition: "top",
};

/**
 * Read settings without writing (safe for public pages + metadata).
 * Never throws — falls back to defaults if the row is missing or the DB is
 * unreachable (e.g. during build-time static generation).
 */
export async function getSettingsSafe() {
  try {
    const existing = await prisma.appSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
    return existing ?? DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/** Read settings, creating the singleton row with defaults if missing. */
export async function getSettings(): Promise<AppSettings> {
  const existing = await prisma.appSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  if (existing) return existing;

  return prisma.appSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
}
