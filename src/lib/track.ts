"use client";

import type { CardEventType } from "@prisma/client";

/**
 * Fire-and-forget analytics tracking from the client.
 * Always uses a RELATIVE URL so it works on any host (IP or domain).
 * Never throws — tracking must never break the user's main action.
 */
export function track(slug: string, type: CardEventType): void {
  try {
    const payload = JSON.stringify({ slug, type });

    // Prefer sendBeacon so it survives navigation (e.g. opening a new tab).
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/events", blob);
      return;
    }

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore tracking failures */
  }
}
