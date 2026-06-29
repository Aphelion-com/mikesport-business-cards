"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Pencil,
  Trash2,
  Power,
  Loader2,
  Users,
  Info,
} from "lucide-react";
import QrModal from "@/components/QrModal";
import { track } from "@/lib/track";
import { timeAgo } from "@/lib/format";
import type { CardWithStats } from "@/lib/analytics";

export default function CardsManager({
  initialCards,
  baseUrl,
}: {
  initialCards: CardWithStats[];
  baseUrl: string;
}) {
  const router = useRouter();
  const [cards, setCards] = useState<CardWithStats[]>(initialCards);
  const [query, setQuery] = useState("");
  const [qrCard, setQrCard] = useState<CardWithStats | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CardWithStats | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = baseUrl.replace(/\/$/, "");
  const urlFor = (slug: string) => `${base}/${slug}`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.position.toLowerCase().includes(q)
    );
  }, [cards, query]);

  async function copyUrl(card: CardWithStats) {
    try {
      await navigator.clipboard.writeText(urlFor(card.slug));
      setCopiedSlug(card.slug);
      track(card.slug, "COPY_URL");
      setTimeout(() => setCopiedSlug(null), 1800);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  function openPreview(card: CardWithStats) {
    track(card.slug, "PREVIEW_OPEN");
    window.open(urlFor(card.slug), "_blank", "noopener,noreferrer");
  }

  async function toggleActive(card: CardWithStats) {
    setBusySlug(card.slug);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !card.isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Failed to update card status.");
        return;
      }
      setCards((prev) =>
        prev.map((c) =>
          c.slug === card.slug ? { ...c, isActive: data.card.isActive } : c
        )
      );
    } catch {
      setError("Network error while updating the card.");
    } finally {
      setBusySlug(null);
    }
  }

  async function doDelete(card: CardWithStats) {
    setBusySlug(card.slug);
    setError(null);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to delete card.");
        return;
      }
      setCards((prev) => prev.filter((c) => c.slug !== card.slug));
      setConfirmDelete(null);
      router.refresh();
    } catch {
      setError("Network error while deleting the card.");
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-soft focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 sm:max-w-md">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or position…"
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <Link
          href="/admin/cards/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
        >
          <Plus className="h-4 w-4" />
          New Card
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
        {filtered.length === 0 ? (
          <EmptyState hasQuery={query.trim().length > 0} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Views</th>
                  <th className="px-4 py-3 text-right font-semibold">Saves</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((card) => (
                  <tr key={card.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {card.profileImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={card.profileImageUrl}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-brand-500">
                            {card.fullName
                              .split(/\s+/)
                              .slice(0, 2)
                              .map((n) => n[0]?.toUpperCase())
                              .join("")}
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/cards/${card.slug}`}
                            className="block truncate font-semibold text-ink-900 hover:text-brand-700"
                          >
                            {card.fullName}
                          </Link>
                          <p className="truncate text-xs text-slate-400">
                            {card.position}
                          </p>
                          <p className="truncate text-xs text-brand-600">
                            /{card.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={card.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                      {card.stats.views}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                      {card.stats.saves}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {timeAgo(card.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <IconBtn
                          title="Copy public URL"
                          onClick={() => copyUrl(card)}
                        >
                          {copiedSlug === card.slug ? (
                            <Check className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </IconBtn>
                        <IconBtn title="QR code" onClick={() => setQrCard(card)}>
                          <QrCode className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn
                          title="Preview public page"
                          onClick={() => openPreview(card)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </IconBtn>
                        <Link
                          href={`/admin/cards/${card.slug}`}
                          title="Details"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Info className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/cards/${card.slug}/edit`}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <IconBtn
                          title={card.isActive ? "Deactivate" : "Activate"}
                          onClick={() => toggleActive(card)}
                          disabled={busySlug === card.slug}
                        >
                          <Power
                            className={`h-4 w-4 ${
                              card.isActive
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          />
                        </IconBtn>
                        <IconBtn
                          title="Delete"
                          onClick={() => setConfirmDelete(card)}
                          danger
                        >
                          <Trash2 className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {filtered.length} {filtered.length === 1 ? "card" : "cards"}
        {query.trim() && ` matching “${query.trim()}”`}
      </p>

      {/* QR modal */}
      {qrCard && (
        <QrModal
          url={urlFor(qrCard.slug)}
          name={qrCard.fullName}
          onClose={() => setQrCard(null)}
          onDownload={() => track(qrCard.slug, "QR_DOWNLOAD")}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink-950">Delete card?</h3>
            <p className="mt-1 text-sm text-slate-500">
              This permanently deletes{" "}
              <span className="font-semibold text-ink-800">
                {confirmDelete.fullName}
              </span>
              &rsquo;s card, its public page, and all analytics. This cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => doDelete(confirmDelete)}
                disabled={busySlug === confirmDelete.slug}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {busySlug === confirmDelete.slug && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`rounded-lg p-2 transition disabled:opacity-50 ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users className="h-7 w-7" />
      </div>
      {hasQuery ? (
        <>
          <p className="mt-4 font-semibold text-ink-800">No cards found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different name, email, or position.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 font-semibold text-ink-800">No cards yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first digital business card to get started.
          </p>
          <Link
            href="/admin/cards/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
          >
            <Plus className="h-4 w-4" />
            New Card
          </Link>
        </>
      )}
    </div>
  );
}

// Re-export for potential reuse.
export { StatusBadge };
