import type { AppSettings } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const SETTINGS_ID = "singleton";

export const DEFAULT_SETTINGS = {
  id: SETTINGS_ID,
  logoUrl: null as string | null,
  dashboardTitle: "Mike Sport Cards",
  accentColor: "#f97316",
  companyWebsite: null as string | null,
  defaultAddress: null as string | null,
  defaultCompanyPhone: null as string | null,
};

/** Read settings without writing (safe for public pages). Falls back to defaults. */
export async function getSettingsSafe() {
  const existing = await prisma.appSettings.findUnique({
    where: { id: SETTINGS_ID },
  });
  return existing ?? DEFAULT_SETTINGS;
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
