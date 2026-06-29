import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Wordmark from "@/components/Wordmark";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink-950 px-6 text-center">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-500" />
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(249,115,22,0.5) 0 2px, transparent 2px 22px)",
        }}
      />
      <div className="relative">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-extrabold text-ink-950">
          MS
        </span>
      </div>
      <div className="relative mt-6">
        <Wordmark onDark className="!text-xl" />
      </div>
      <p className="relative mt-3 max-w-md text-slate-400">
        Digital Business Cards — professional, shareable contact pages for the
        Mike Sport team.
      </p>
      <Link
        href="/admin"
        className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-950 shadow-lg transition hover:bg-brand-400"
      >
        Open Admin Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
