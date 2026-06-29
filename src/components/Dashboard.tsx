"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Card } from "@prisma/client";
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
  CreditCard,
  CircleCheck,
  Loader2,
  LogOut,
  Users,
} from "lucide-react";
import QrModal from "@/components/QrModal";

type Props = {
  initialCards: Card[];
  baseUrl: string;
};

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard({ initialCards, baseUrl }: Props) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [qrCard, setQrCard] = useState<Card | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Card | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);

  // Debounced server-side search.
  useEffect(() => {
    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/cards?q=${encodeURIComponent(query.trim())}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data = await res.json();
          setCards(data.cards);
        }
      } finally {
        setSearching(false);
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  const stats = useMemo(() => {
    const total = cards.length;
    const active = cards.filter((c) => c.isActive).length;
    return { total, active };
  }, [cards]);

  function urlFor(slug: string) {
    return `${baseUrl.replace(/\/$/, "")}/${slug}`;
  }

  async function copyUrl(slug: string) {
    try {
      await navigator.clipboard.writeText(urlFor(slug));
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 1800);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function toggleActive(card: Card) {
    setBusySlug(card.slug);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !card.isActive }),
      });
      if (res.ok) {
        const data = await res.json();
        setCards((prev) =>
          prev.map((c) => (c.slug === card.slug ? data.card : c))
        );
      }
    } finally {
      setBusySlug(null);
    }
  }

  async function doDelete(card: Card) {
    setBusySlug(card.slug);
    try {
      const res = await fetch(`/api/cards/${card.slug}`, { method: "DELETE" });
      if (res.ok) {
        setCards((prev) => prev.filter((c) => c.slug !== card.slug));
        setConfirmDelete(null);
      }
    } finally {
      setBusySlug(null);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Business Cards
          </h1>
          <p className="text-sm text-slate-500">Mike Sport admin dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <Link
            href="/admin/cards/new"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Card
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={<CreditCard className="h-6 w-6 text-brand-700" />}
          label="Total cards"
          value={stats.total}
          accent="bg-brand-600/10"
        />
        <StatCard
          icon={<CircleCheck className="h-6 w-6 text-emerald-600" />}
          label="Active cards"
          value={stats.active}
          accent="bg-emerald-500/10"
        />
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        {searching ? (
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        ) : (
          <Search className="h-5 w-5 text-slate-400" />
        )}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or position…"
          className="w-full bg-transparent py-3 text-sm outline-none"
        />
      </div>

      {/* List */}
      <div className="mt-6">
        {cards.length === 0 ? (
          <EmptyState hasQuery={query.trim().length > 0} />
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Identity */}
                <div className="flex min-w-0 items-center gap-3">
                  {card.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.profileImageUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                      {card.fullName
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase())
                        .join("")}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {card.fullName}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          card.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {card.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="truncate text-sm text-slate-500">
                      {card.position}
                    </p>
                    <p className="truncate text-xs text-brand-600">
                      /{card.slug}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-1">
                  <IconBtn
                    title="Copy public URL"
                    onClick={() => copyUrl(card.slug)}
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

                  <a
                    href={urlFor(card.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Preview public page"
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>

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
                        card.isActive ? "text-emerald-600" : "text-slate-400"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR modal */}
      {qrCard && (
        <QrModal
          url={urlFor(qrCard.slug)}
          name={qrCard.fullName}
          onClose={() => setQrCard(null)}
        />
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Delete card?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              This will permanently delete{" "}
              <span className="font-semibold text-slate-700">
                {confirmDelete.fullName}
              </span>
              &rsquo;s card and its public page. This cannot be undone.
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
    </div>
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
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Users className="h-7 w-7" />
      </div>
      {hasQuery ? (
        <>
          <p className="mt-4 font-semibold text-slate-700">No cards found</p>
          <p className="mt-1 text-sm text-slate-500">
            Try a different name, email, or position.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 font-semibold text-slate-700">No cards yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first digital business card to get started.
          </p>
          <Link
            href="/admin/cards/new"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            New Card
          </Link>
        </>
      )}
    </div>
  );
}
