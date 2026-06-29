"use client";

/**
 * URL helpers for the dashboard (client side).
 *
 * - Official URL: based on NEXT_PUBLIC_BASE_URL (e.g. https://cards.mikesport.tech).
 *   This is the canonical link to share + the QR target.
 * - Test/preview URL: based on the current window origin, so previews work
 *   while the app is opened by IP (http://145.223.101.109:3015) before the
 *   domain is routed, and later on the real domain too.
 */

function trim(url: string): string {
  return url.replace(/\/$/, "");
}

export function officialBaseUrl(): string {
  const env = process.env.NEXT_PUBLIC_BASE_URL;
  if (env && env.trim()) return trim(env.trim());
  if (typeof window !== "undefined") return trim(window.location.origin);
  return "";
}

export function officialUrl(slug: string): string {
  return `${officialBaseUrl()}/${slug}`;
}

/** Current-origin URL — always reachable from wherever you opened the app. */
export function previewUrl(slug: string): string {
  if (typeof window !== "undefined") {
    return `${trim(window.location.origin)}/${slug}`;
  }
  return officialUrl(slug);
}
