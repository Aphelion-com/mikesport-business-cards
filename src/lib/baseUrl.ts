/**
 * Public base URL used to build card links and QR codes.
 * Comes from NEXT_PUBLIC_BASE_URL, e.g. https://cards.mikesport.tech
 */
export function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3015";
  return url.replace(/\/$/, "");
}

export function publicCardUrl(slug: string): string {
  return `${getBaseUrl()}/${slug}`;
}
