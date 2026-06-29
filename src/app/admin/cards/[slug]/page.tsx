import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Eye,
  Download,
  QrCode,
  Copy,
  ExternalLink,
  Mail,
  Smartphone,
  Phone,
  Activity,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import CardDetailActions from "@/components/admin/CardDetailActions";
import StatusToggle from "@/components/admin/StatusToggle";
import { StatusBadge } from "@/components/admin/CardsManager";
import { prisma } from "@/lib/prisma";
import { getCardStats } from "@/lib/analytics";
import { publicCardUrl } from "@/lib/baseUrl";
import { EVENT_LABEL, timeAgo, shortDate } from "@/lib/format";

export const metadata = { title: "Card details — Mike Sport" };
export const dynamic = "force-dynamic";

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-ink-950">{value}</p>
    </div>
  );
}

export default async function CardDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  const card = await prisma.card.findUnique({ where: { slug: params.slug } });
  if (!card) {
    notFound();
  }

  const { counts, recent } = await getCardStats(card.id);
  const publicUrl = publicCardUrl(card.slug);

  return (
    <AdminLayout active="/admin/cards">
      <Link
        href="/admin/cards"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cards
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {card.profileImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={card.profileImageUrl}
              alt={card.profileImageAlt || card.fullName}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-950 text-lg font-bold text-brand-500">
              {card.fullName
                .split(/\s+/)
                .slice(0, 2)
                .map((n) => n[0]?.toUpperCase())
                .join("")}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-ink-950">
                {card.fullName}
              </h1>
              <StatusBadge active={card.isActive} />
            </div>
            <p className="text-sm text-slate-500">
              {card.position}
              {card.department ? ` · ${card.department}` : ""}
              {card.companyName ? ` · ${card.companyName}` : ""}
            </p>
            <p className="text-xs text-brand-600">/{card.slug}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusToggle slug={card.slug} initialActive={card.isActive} />
          <Link
            href={`/admin/cards/${card.slug}/edit`}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MiniStat icon={<Eye className="h-4 w-4" />} label="Views" value={counts.views} />
        <MiniStat
          icon={<Download className="h-4 w-4" />}
          label="Saves"
          value={counts.saves}
        />
        <MiniStat
          icon={<QrCode className="h-4 w-4" />}
          label="QR downloads"
          value={counts.qrDownloads}
        />
        <MiniStat
          icon={<Copy className="h-4 w-4" />}
          label="URL copies"
          value={counts.copies}
        />
        <MiniStat
          icon={<ExternalLink className="h-4 w-4" />}
          label="Previews"
          value={counts.previews}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* QR + links */}
        <div className="lg:col-span-2">
          <CardDetailActions
            slug={card.slug}
            fullName={card.fullName}
            publicUrl={publicUrl}
          />
        </div>

        {/* Contact + recent events */}
        <div className="space-y-6 lg:col-span-3">
          {card.description && (
            <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
              <h2 className="font-semibold text-ink-950">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {card.description}
              </p>
            </section>
          )}

          <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <h2 className="font-semibold text-ink-950">Contact details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row icon={<Smartphone className="h-4 w-4" />} label="Mobile" value={card.mobilePhone} />
              {card.companyPhone && (
                <Row
                  icon={<Phone className="h-4 w-4" />}
                  label="Company"
                  value={
                    card.extension
                      ? `${card.companyPhone} · ext ${card.extension}`
                      : card.companyPhone
                  }
                />
              )}
              <Row icon={<Mail className="h-4 w-4" />} label="Email" value={card.email} />
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
                <span>Created {shortDate(card.createdAt)}</span>
                <span>Updated {timeAgo(card.updatedAt)}</span>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-600" />
              <h2 className="font-semibold text-ink-950">Recent events</h2>
            </div>
            {recent.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                No events recorded yet for this card.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {recent.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 text-sm">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                    <span className="flex-1 text-ink-900">
                      {EVENT_LABEL[e.type]}
                    </span>
                    <span className="text-xs text-slate-400">
                      {timeAgo(e.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      <div>
        <dt className="text-xs text-slate-400">{label}</dt>
        <dd className="font-medium text-ink-900">{value}</dd>
      </div>
    </div>
  );
}
