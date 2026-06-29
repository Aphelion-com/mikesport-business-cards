import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-card">
        <SearchX className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-slate-900">
        Card not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This business card doesn&rsquo;t exist or is no longer active.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Go to homepage
      </Link>
    </main>
  );
}
