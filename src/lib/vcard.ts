import type { Card } from "@prisma/client";

export const ORGANIZATION = "Mike Sport";

/** Escape special characters per vCard 3.0 spec (RFC 2426). */
function esc(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Split a full name into family / given for the structured N field. */
function splitName(fullName: string): { family: string; given: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { family: parts[0], given: "" };
  }
  const given = parts.slice(0, -1).join(" ");
  const family = parts[parts.length - 1];
  return { family, given };
}

/**
 * Build a valid vCard 3.0 string for a card.
 * `baseUrl` is used to turn a relative profile image (/api/uploads/…) into an
 * absolute URL for the PHOTO field. Missing image never breaks the vCard.
 */
export function buildVCard(card: Card, baseUrl?: string): string {
  const { family, given } = splitName(card.fullName);

  const org = card.companyName || ORGANIZATION;
  // ORG can carry a department as its second component: ORG:Company;Department
  const orgLine = card.department
    ? `ORG:${esc(org)};${esc(card.department)}`
    : `ORG:${esc(org)}`;

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(family)};${esc(given)};;;`,
    `FN:${esc(card.fullName)}`,
    orgLine,
    `TITLE:${esc(card.position)}`,
  ];

  if (card.mobilePhone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${esc(card.mobilePhone)}`);
  }
  if (card.companyPhone) {
    const work = card.extension
      ? `${card.companyPhone};ext=${card.extension}`
      : card.companyPhone;
    lines.push(`TEL;TYPE=WORK,VOICE:${esc(work)}`);
  }
  if (card.email) {
    lines.push(`EMAIL;TYPE=INTERNET,WORK:${esc(card.email)}`);
  }
  if (card.website) {
    lines.push(`URL:${esc(card.website)}`);
  }
  if (card.address) {
    // ADR structured: ;;street;city;region;postal;country
    lines.push(`ADR;TYPE=WORK:;;${esc(card.address)};;;;`);
  }
  if (card.profileImageUrl) {
    const photo =
      card.profileImageUrl.startsWith("/") && baseUrl
        ? `${baseUrl.replace(/\/$/, "")}${card.profileImageUrl}`
        : card.profileImageUrl;
    lines.push(`PHOTO;VALUE=URI:${esc(photo)}`);
  }
  if (card.description) {
    lines.push(`NOTE:${esc(card.description)}`);
  }

  // Social profiles as URLs
  for (const url of [
    card.linkedinUrl,
    card.instagramUrl,
    card.facebookUrl,
    card.tiktokUrl,
  ]) {
    if (url) lines.push(`URL:${esc(url)}`);
  }

  lines.push("END:VCARD");

  // vCard requires CRLF line endings
  return lines.join("\r\n");
}

/** Filename-safe .vcf name from the full name. */
export function vcardFilename(fullName: string): string {
  const safe = fullName.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${safe || "contact"}.vcf`;
}
