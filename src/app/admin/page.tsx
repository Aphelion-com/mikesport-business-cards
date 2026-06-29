import Link from "next/link";
import {
  CreditCard,
  CircleCheck,
  CircleSlash,
  Eye,
  Download,
  QrCode,
  ArrowRight,
  Activity,
  Trophy,
  Clock,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { WeeklyBars, TopBars } from "@/components/admin/Charts";
import {
  getOverview,
  getMostViewed,
  getMostSaved,
  getRecentActivity,
  getRecentlyUpdated,
  getDailyActivity,
} from "@/lib/analytics";
import { EVENT_LABEL, timeAgo } from "@/lib/format";

export const metadata = { title: "Overview — Mike Sport" };
export const dynamic = "force-dynamic";

function StatCard({
  icon,
  label,
  value,
  accent,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-ink-950">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

function Highlight({
  icon,
  title,
  name,
  sub,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  name: string;
  sub: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-soft ring-1 ring-slate-100 transition hover:shadow-card">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <p className="truncate font-semibold text-ink-900">{name}</p>
        <p className="truncate text-xs text-slate-400">{sub}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function OverviewPage() {
  const [overview, mostViewed, mostSaved, recent, recentlyUpdated, daily] =
    await Promise.all([
      getOverview(),
      getMostViewed(5),
      getMostSaved(5),
      getRecentActivity(8),
      getRecentlyUpdated(5),
      getDailyActivity(7),
    ]);

  const topViewer = mostViewed[0];
  const topSaver = mostSaved[0];

  return (
    <AdminLayout active="/admin" title="Overview">
      {/* Stat grid: 1 col mobile / 2 tablet / 3-6 desktop */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard delay={0} icon={<CreditCard className="h-5 w-5 text-ink-700" />} label="Total cards" value={overview.totalCards} accent="bg-slate-100" />
        <StatCard delay={40} icon={<CircleCheck className="h-5 w-5 text-emerald-600" />} label="Active" value={overview.activeCards} accent="bg-emerald-50" />
        <StatCard delay={80} icon={<CircleSlash className="h-5 w-5 text-slate-500" />} label="Inactive" value={overview.inactiveCards} accent="bg-slate-100" />
        <StatCard delay={120} icon={<Eye className="h-5 w-5 text-brand-600" />} label="Total views" value={overview.totalViews} accent="bg-brand-50" />
        <StatCard delay={160} icon={<Download className="h-5 w-5 text-brand-600" />} label="Contacts saved" value={overview.totalSaves} accent="bg-brand-50" />
        <StatCard delay={200} icon={<QrCode className="h-5 w-5 text-brand-600" />} label="QR downloads" value={overview.totalQrDownloads} accent="bg-brand-50" />
      </div>

      {/* Highlights */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Highlight
          icon={<Trophy className="h-5 w-5" />}
          title="Most viewed"
          name={topViewer ? topViewer.fullName : "—"}
          sub={topViewer ? `${topViewer.stats.views} views` : "No views yet"}
          href={topViewer ? `/admin/cards/${topViewer.slug}` : undefined}
        />
        <Highlight
          icon={<Download className="h-5 w-5" />}
          title="Most saved"
          name={topSaver ? topSaver.fullName : "—"}
          sub={topSaver ? `${topSaver.stats.saves} saves` : "No saves yet"}
          href={topSaver ? `/admin/cards/${topSaver.slug}` : undefined}
        />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-semibold text-ink-950">Activity — last 7 days</h2>
          <p className="text-xs text-slate-400">Page views & contacts saved</p>
          <div className="mt-4">
            <WeeklyBars data={daily} />
          </div>
        </section>

        <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-semibold text-ink-950">Top cards by views</h2>
          <div className="mt-4">
            <TopBars
              items={mostViewed.map((c) => ({ label: c.fullName, value: c.stats.views }))}
              emptyText="No views recorded yet."
            />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Recent activity */}
        <section className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-600" />
              <h2 className="font-semibold text-ink-950">Recent activity</h2>
            </div>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Analytics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No activity yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recent.map((e) => (
                <li key={e.id} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  <div className="min-w-0 flex-1">
                    <p className="text-ink-900">
                      <span className="font-medium">{EVENT_LABEL[e.type]}</span>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <span className="text-slate-600">{e.card.fullName}</span>
                    </p>
                    <p className="text-xs text-slate-400">{timeAgo(e.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recently updated */}
        <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand-600" />
            <h2 className="font-semibold text-ink-950">Recently updated</h2>
          </div>
          {recentlyUpdated.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No cards yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {recentlyUpdated.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/admin/cards/${c.slug}`}
                    className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 transition hover:border-brand-200 hover:bg-brand-50/40"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">
                        {c.fullName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {c.position}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0 text-xs text-slate-400">
                      {timeAgo(c.updatedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
