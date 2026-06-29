import Link from "next/link";
import { ArrowRight, IdCard } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-6 text-center text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
        <IdCard className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
        Mike Sport
      </h1>
      <p className="mt-2 max-w-md text-brand-100">
        Digital Business Cards — professional, shareable contact pages for the
        Mike Sport team.
      </p>
      <Link
        href="/admin"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
      >
        Open Admin Dashboard
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}
