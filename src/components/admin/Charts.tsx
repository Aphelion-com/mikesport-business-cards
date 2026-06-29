import type { DayPoint } from "@/lib/analytics";

/** 7-day grouped bars for views & saves (pure CSS, no chart lib). */
export function WeeklyBars({ data }: { data: DayPoint[] }) {
  const max = Math.max(1, ...data.map((d) => Math.max(d.views, d.saves)));

  return (
    <div>
      <div className="flex items-end justify-between gap-2 sm:gap-3">
        {data.map((d, i) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-32 w-full items-end justify-center gap-1">
              <div
                className="w-1/2 origin-bottom animate-grow-bar rounded-t-md bg-brand-500"
                style={{
                  height: `${(d.views / max) * 100}%`,
                  minHeight: d.views > 0 ? "4px" : "0",
                  animationDelay: `${i * 60}ms`,
                }}
                title={`${d.views} views`}
              />
              <div
                className="w-1/2 origin-bottom animate-grow-bar rounded-t-md bg-ink-800"
                style={{
                  height: `${(d.saves / max) * 100}%`,
                  minHeight: d.saves > 0 ? "4px" : "0",
                  animationDelay: `${i * 60 + 30}ms`,
                }}
                title={`${d.saves} saves`}
              />
            </div>
            <span className="text-[11px] font-medium text-slate-400">
              {d.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-500" /> Views
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-ink-800" /> Saves
        </span>
      </div>
    </div>
  );
}

export type TopBarItem = { label: string; sublabel?: string; value: number };

/** Horizontal ranking bars for "top cards by X". */
export function TopBars({
  items,
  emptyText = "No data yet.",
}: {
  items: TopBarItem[];
  emptyText?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0 || items.every((i) => i.value === 0)) {
    return <p className="py-6 text-sm text-slate-400">{emptyText}</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate font-medium text-ink-800">{it.label}</span>
            <span className="ml-2 tabular-nums text-slate-500">{it.value}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(it.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
