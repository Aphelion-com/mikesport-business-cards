import Link from "next/link";
import { SearchX } from "lucide-react";
import Wordmark from "@/components/Wordmark";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink-950 px-6 text-center">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-brand-500" />
      <Wordmark onDark className="mb-10" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-brand-500">
        <SearchX className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold text-white">Card not found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        This business card doesn&rsquo;t exist. Please double-check the link.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-brand-400"
      >
        Go to homepage
      </Link>
    </main>
  );
}
