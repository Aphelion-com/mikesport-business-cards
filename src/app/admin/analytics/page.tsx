import Link from "next/link";
import { Eye, Download, QrCode, Copy, ExternalLink, Activity } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { WeeklyBars, TopBars } from "@/components/admin/Charts";
import {
  getOverview,
  getCardsWithStats,
  getRecentActivity,
  getDailyActivity,
} from "@/lib/analytics";
import { EVENT_LABEL, timeAgo } from "@/lib/format";

export const metadata = { title: "Analytics — Mike Sport" };
export const dynamic = "force-dynamic";

function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tracking-tight text-ink-950">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default async function AnalyticsPage() {
  const [overview, cards, recent, daily] = await Promise.all([
    getOverview(),
    getCardsWithStats(),
    getRecentActivity(15),
    getDailyActivity(7),
  ]);

  const byViews = [...cards].sort((a, b) => b.stats.views - a.stats.views);
  const bySaves = [...cards].sort((a, b) => b.stats.saves - a.stats.saves);

  return (
    <AdminLayout active="/admin/analytics" title="Analytics">
      {/* Totals: 1 / 2 / 4 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tile icon={<Eye className="h-4 w-4 text-brand-600" />} label="Total views" value={overview.totalViews} />
        <Tile icon={<Download className="h-4 w-4 text-brand-600" />} label="Contacts saved" value={overview.totalSaves} />
        <Tile icon={<QrCode className="h-4 w-4 text-brand-600" />} label="QR downloads" value={overview.totalQrDownloads} />
        <Tile icon={<Eye className="h-4 w-4 text-slate-500" />} label="Total cards" value={overview.totalCards} />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-semibold text-ink-950">Activity — last 7 days</h2>
          <div className="mt-4">
            <WeeklyBars data={daily} />
          </div>
        </section>
        <section className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
          <h2 className="font-semibold text-ink-950">Top by Save Contact</h2>
          <div className="mt-4">
            <TopBars
              items={bySaves.slice(0, 5).map((c) => ({ label: c.fullName, value: c.stats.saves }))}
              emptyText="No saves recorded yet."
            />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Per-card table (desktop) / cards (mobile) */}
        <section className="lg:col-span-3 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-ink-950">Views & saves per card</h2>
          </div>
          {byViews.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-400">
              No cards yet.
            </p>
          ) : (
            <>
              {/* desktop table */}
              <div className="hidden sm:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-3 font-semibold">Employee</th>
                      <th className="px-3 py-3 text-right font-semibold">Views</th>
                      <th className="px-3 py-3 text-right font-semibold">Saves</th>
                      <th className="px-3 py-3 text-right font-semibold">QR</th>
                      <th className="px-3 py-3 text-right font-semibold">Copies</th>
                      <th className="px-3 py-3 pr-5 text-right font-semibold">Previews</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {byViews.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-3">
                          <Link href={`/admin/cards/${c.slug}`} className="font-medium text-ink-900 hover:text-brand-700">
                            {c.fullName}
                          </Link>
                          <p className="text-xs text-slate-400">{c.position}</p>
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums text-ink-800">{c.stats.views}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-ink-800">{c.stats.saves}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-500">{c.stats.qrDownloads}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-500">{c.stats.copies}</td>
                        <td className="px-3 py-3 pr-5 text-right tabular-nums text-slate-500">{c.stats.previews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* mobile cards */}
              <ul className="divide-y divide-slate-100 sm:hidden">
                {byViews.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <Link href={`/admin/cards/${c.slug}`} className="font-medium text-ink-900">
                      {c.fullName}
                    </Link>
                    <p className="text-xs text-slate-400">{c.position}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>{c.stats.views} views</span>
                      <span>{c.stats.saves} saves</span>
                      <span>{c.stats.qrDownloads} QR</span>
                      <span>{c.stats.copies} copies</span>
                      <span>{c.stats.previews} previews</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
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
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Columns: views · saves · QR downloads · URL copies · previews
      </p>
    </AdminLayout>
  );
}
