import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/health — lightweight liveness probe (public, never blocked).
export function GET() {
  return NextResponse.json({
    ok: true,
    service: "Mike Sport Digital Cards",
  });
}
