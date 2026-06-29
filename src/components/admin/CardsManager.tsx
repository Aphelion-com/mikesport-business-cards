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
  Eye,
  Download,
  Mail,
} from "lucide-react";
import QrModal from "@/components/QrModal";
import Toast, { type ToastState } from "@/components/admin/Toast";
import { track } from "@/lib/track";
import { timeAgo } from "@/lib/format";
import { copyToClipboard } from "@/lib/clipboard";
import { officialUrl, previewUrl } from "@/lib/publicUrl";
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
  const [toast, setToast] = useState<ToastState>(null);

  // Official URL (NEXT_PUBLIC_BASE_URL / domain) is what we share + QR.
  const urlFor = (slug: string) => officialUrl(slug) || `${baseUrl.replace(/\/$/, "")}/${slug}`;

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
    const ok = await copyToClipboard(urlFor(card.slug));
    if (ok) {
      setCopiedSlug(card.slug);
      setToast({ message: "Link copied.", variant: "success" });
      track(card.slug, "COPY_URL"); // tracking must not block copy
      setTimeout(() => setCopiedSlug(null), 1800);
    } else {
      setToast({ message: "Could not copy. Please copy it manually.", variant: "error" });
    }
  }

  function openPreview(card: CardWithStats) {
    track(card.slug, "PREVIEW_OPEN");
    // Use current-origin URL so preview works on IP now AND the domain later.
    window.open(previewUrl(card.slug), "_blank", "noopener,noreferrer");
  }

  async function toggleActive(card: CardWithStats) {
    setBusySlug(card.slug);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !card.isActive }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({
          message: data.error || "Failed to update status.",
          variant: "error",
        });
        return;
      }
      setCards((prev) =>
        prev.map((c) =>
          c.slug === card.slug ? { ...c, isActive: data.card.isActive } : c
        )
      );
      setToast({
        message: data.card.isActive ? "Card activated." : "Card deactivated.",
        variant: "success",
      });
    } catch {
      setToast({ message: "Network error.", variant: "error" });
    } finally {
      setBusySlug(null);
    }
  }

  async function doDelete(card: CardWithStats) {
    setBusySlug(card.slug);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setToast({
          message: data.error || "Failed to delete card.",
          variant: "error",
        });
        return;
      }
      setCards((prev) => prev.filter((c) => c.slug !== card.slug));
      setConfirmDelete(null);
      setToast({ message: "Card deleted.", variant: "success" });
      router.refresh();
    } catch {
      setToast({ message: "Network error.", variant: "error" });
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 shadow-soft focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 sm:max-w-md">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or position…"
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </div>
        <Link
          href="/admin/cards/new"
          className="btn-shine inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          New Card
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-5 rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <EmptyState hasQuery={query.trim().length > 0} />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-5 hidden overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100 lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 text-right font-semibold">Views</th>
                  <th className="px-3 py-3 text-right font-semibold">Saves</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((card, i) => (
                  <tr
                    key={card.id}
                    className="animate-fade-in-up hover:bg-slate-50/60"
                    style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar card={card} />
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
                          <p className="truncate text-xs text-slate-400">
                            {card.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge active={card.isActive} />
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-800">
                      {card.stats.views}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-ink-800">
                      {card.stats.saves}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {timeAgo(card.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        <IconBtn title="Copy URL" onClick={() => copyUrl(card)}>
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
                        <IconLink href={`/admin/cards/${card.slug}`} title="Details">
                          <Info className="h-4 w-4" />
                        </IconLink>
                        <IconLink
                          href={`/admin/cards/${card.slug}/edit`}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </IconLink>
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

          {/* Mobile cards */}
          <div className="mt-5 space-y-3 lg:hidden">
            {filtered.map((card, i) => (
              <div
                key={card.id}
                className="animate-fade-in-up rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Avatar card={card} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/cards/${card.slug}`}
                        className="truncate font-semibold text-ink-900"
                      >
                        {card.fullName}
                      </Link>
                      <StatusBadge active={card.isActive} />
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {card.position}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                      <Mail className="h-3 w-3" /> {card.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Eye className="h-4 w-4 text-slate-400" /> {card.stats.views}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-600">
                    <Download className="h-4 w-4 text-slate-400" />{" "}
                    {card.stats.saves}
                  </span>
                  <span className="ml-auto text-xs text-slate-400">
                    {timeAgo(card.updatedAt)}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <MobileBtn onClick={() => openPreview(card)}>
                    <ExternalLink className="h-4 w-4" /> Preview
                  </MobileBtn>
                  <MobileBtn onClick={() => setQrCard(card)}>
                    <QrCode className="h-4 w-4" /> QR
                  </MobileBtn>
                  <MobileBtn onClick={() => copyUrl(card)}>
                    {copiedSlug === card.slug ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy URL
                      </>
                    )}
                  </MobileBtn>
                  <Link
                    href={`/admin/cards/${card.slug}/edit`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:bg-brand-50"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </Link>
                  <MobileBtn
                    onClick={() => toggleActive(card)}
                    disabled={busySlug === card.slug}
                  >
                    <Power
                      className={`h-4 w-4 ${
                        card.isActive ? "text-emerald-600" : "text-slate-400"
                      }`}
                    />
                    {card.isActive ? "Deactivate" : "Activate"}
                  </MobileBtn>
                  <MobileBtn onClick={() => setConfirmDelete(card)} danger>
                    <Trash2 className="h-4 w-4" /> Delete
                  </MobileBtn>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-slate-400">
        {filtered.length} {filtered.length === 1 ? "card" : "cards"}
        {query.trim() && ` matching “${query.trim()}”`}
      </p>

      {qrCard && (
        <QrModal
          url={urlFor(qrCard.slug)}
          name={qrCard.fullName}
          onClose={() => setQrCard(null)}
          onDownload={() => track(qrCard.slug, "QR_DOWNLOAD")}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm animate-scale-in rounded-3xl bg-white p-6 shadow-2xl"
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

      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  );
}

function Avatar({ card }: { card: CardWithStats }) {
  if (card.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={card.profileImageUrl}
        alt={card.profileImageAlt || card.fullName}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-brand-500">
      {card.fullName
        .split(/\s+/)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("")}
    </div>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
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

function IconLink({
  children,
  href,
  title,
}: {
  children: React.ReactNode;
  href: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      title={title}
      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
    >
      {children}
    </Link>
  );
}

function MobileBtn({
  children,
  onClick,
  danger,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
        danger
          ? "border-slate-200 text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          : "border-slate-200 text-ink-800 hover:border-brand-300 hover:bg-brand-50"
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
