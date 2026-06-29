import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { getSettings, SETTINGS_ID } from "@/lib/settings";
import { settingsSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

// GET /api/settings (admin only)
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

// PATCH /api/settings (admin only)
export async function PATCH(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const settings = await prisma.appSettings.upsert({
      where: { id: SETTINGS_ID },
      update: parsed.data,
      create: { id: SETTINGS_ID, ...parsed.data },
    });

    return NextResponse.json({ settings });
  } catch (err) {
    console.error("Update settings error:", err);
    return NextResponse.json(
      { error: "Failed to save settings." },
      { status: 500 }
    );
  }
}
