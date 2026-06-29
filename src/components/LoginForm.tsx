"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2 } from "lucide-react";
import Wordmark from "@/components/Wordmark";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Abort the request after ~15s so the button never stays stuck forever.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      // Always use a RELATIVE URL so it works on any host (IP or domain).
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Invalid username or password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Login timed out. Please check your connection and try again.");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-in-up">
      <div className="mb-8 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-xl font-extrabold text-ink-950 shadow-lg shadow-brand-500/30">
          MS
        </span>
        <div className="mt-4">
          <Wordmark onDark className="!text-lg" />
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Mike Sport Digital Cards Admin
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
      >
        {error && (
          <div className="mb-4 animate-fade-in rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-slate-200">Username</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/15 bg-ink-950/40 px-3 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30">
            <User className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="admin"
              required
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-slate-200">Password</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/15 bg-ink-950/40 px-3 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/30">
            <Lock className="h-4 w-4 text-slate-400" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="••••••••"
              required
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 font-semibold text-ink-950 transition hover:bg-brand-400 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Mike Sport
      </p>
    </div>
  );
}
