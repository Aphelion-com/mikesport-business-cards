import type { CardEventType } from "@prisma/client";

/** Human-friendly relative time, e.g. "3m ago", "2h ago", "5d ago". */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 45) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** Short date like "29 Jun 2026". */
export function shortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export const EVENT_LABEL: Record<CardEventType, string> = {
  PAGE_VIEW: "Page view",
  SAVE_CONTACT: "Saved contact",
  QR_DOWNLOAD: "QR downloaded",
  COPY_URL: "Copied URL",
  PREVIEW_OPEN: "Opened preview",
  SOCIAL_CLICK: "Social click",
};
