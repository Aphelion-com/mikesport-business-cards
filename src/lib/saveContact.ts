"use client";

import { track } from "@/lib/track";

/**
 * Track SAVE_CONTACT (fire-and-forget) and download the vCard.
 * Tracking never blocks the download.
 */
export function downloadVcard(slug: string): void {
  track(slug, "SAVE_CONTACT");
  const link = document.createElement("a");
  link.href = `/api/cards/${slug}/vcf`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
