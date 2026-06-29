import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildVCard } from "@/lib/vcard";
import { getBaseUrl } from "@/lib/baseUrl";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const card = await prisma.card.findUnique({
      where: { slug: params.slug },
    });

    if (!card || !card.isActive) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const vcf = buildVCard(card, getBaseUrl());

    return new NextResponse(vcf, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        // Filename based on the slug, e.g. rawad-halloun.vcf
        "Content-Disposition": `attachment; filename="${card.slug}.vcf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("vCard generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate contact" },
      { status: 500 }
    );
  }
}
