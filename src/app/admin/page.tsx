import Link from "next/link";
import {
  CreditCard,
  CircleCheck,
  CircleSlash,
  Eye,
  Download,
  ArrowRight,
  Activity,
} from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  getOverview,
  getMostViewed,
  getRecentActivity,
} from "@/lib/analytics";
import { EVENT_LABEL, timeAgo } from "@/lib/format";

export const metadata = { title: "Overview — Mike Sport" };
export const dynamic = "force-dynamic";

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
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
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

export default async function OverviewPage() {
  const [overview, mostViewed, recent] = await Promise.all([
    getOverview(),
    getMostViewed(5),
    getRecentActivity(10),
  ]);

  return (
    <AdminShell active="/admin" title="Overview">
      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard
          icon={<CreditCard className="h-5 w-5 text-ink-700" />}
          label="Total cards"
          value={overview.totalCards}
          accent="bg-slate-100"
        />
        <StatCard
          icon={<CircleCheck className="h-5 w-5 text-emerald-600" />}
          label="Active"
          value={overview.activeCards}
          accent="bg-emerald-50"
        />
        <StatCard
          icon={<CircleSlash className="h-5 w-5 text-slate-500" />}
          label="Inactive"
          value={overview.inactiveCards}
          accent="bg-slate-100"
        />
        <StatCard
          icon={<Eye className="h-5 w-5 text-brand-600" />}
          label="Total views"
          value={overview.totalViews}
          accent="bg-brand-50"
        />
        <StatCard
          icon={<Download className="h-5 w-5 text-brand-600" />}
          label="Contacts saved"
          value={overview.totalSaves}
          accent="bg-brand-50"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Most viewed */}
        <section className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-950">Most viewed cards</h2>
            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Analytics <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {mostViewed.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">No cards yet.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {mostViewed.map((c, i) => (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-xs font-bold text-brand-500">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/cards/${c.slug}`}
                      className="block truncate font-medium text-ink-900 hover:text-brand-700"
                    >
                      {c.fullName}
                    </Link>
                    <p className="truncate text-xs text-slate-400">
                      {c.position}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Eye className="h-4 w-4 text-slate-400" /> {c.stats.views}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Download className="h-4 w-4 text-slate-400" />{" "}
                      {c.stats.saves}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent activity */}
        <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand-600" />
            <h2 className="font-semibold text-ink-950">Recent activity</h2>
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
                      <span className="font-medium">
                        {EVENT_LABEL[e.type]}
                      </span>{" "}
                      <span className="text-slate-400">·</span>{" "}
                      <span className="text-slate-600">{e.card.fullName}</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      {timeAgo(e.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
