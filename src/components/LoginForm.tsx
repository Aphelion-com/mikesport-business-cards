"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Loader2, Eye, EyeOff } from "lucide-react";
import Brand from "@/components/Brand";

export default function LoginForm({
  logoUrl,
  dashboardTitle,
}: {
  logoUrl?: string | null;
  dashboardTitle?: string | null;
}) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full max-w-md animate-fade-in-up">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-warmborder/80 bg-white/85 p-7 shadow-[0_30px_70px_-32px_rgba(25,25,25,0.45)] backdrop-blur-xl sm:p-9"
      >
        {/* Brand header inside card */}
        <div className="mb-6 flex flex-col items-center text-center">
          {logoUrl ? (
            <Brand
              logoUrl={logoUrl}
              title={dashboardTitle}
              imgClassName="h-16 w-auto max-w-[220px] object-contain"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-2xl font-extrabold text-white shadow-lg shadow-brand-500/40">
              MS
            </span>
          )}
          <h1 className="mt-4 text-xl font-bold tracking-tight text-graphite">
            Mike Sport Digital Cards
          </h1>
          <p className="mt-0.5 text-sm font-medium text-muted">Admin Portal</p>
        </div>

        {error && (
          <div className="mb-4 animate-fade-in rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <label className="block">
          <span className="text-sm font-medium text-graphite">Username</span>
          <div className="login-field mt-1.5 flex items-center gap-2.5 rounded-xl border border-warmborder bg-white px-3.5">
            <User className="h-4 w-4 shrink-0 text-muted" />
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-0 bg-transparent py-3 text-sm text-graphite outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus-visible:outline-none"
              placeholder="admin"
              required
            />
          </div>
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-graphite">Password</span>
          <div className="login-field mt-1.5 flex items-center gap-2.5 rounded-xl border border-warmborder bg-white px-3.5">
            <Lock className="h-4 w-4 shrink-0 text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 bg-transparent py-3 text-sm text-graphite outline-none ring-0 placeholder:text-slate-400 focus:outline-none focus-visible:outline-none"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="shrink-0 rounded-lg p-1.5 text-muted outline-none transition hover:bg-cream hover:text-graphite focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-shine mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 outline-none transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-60"
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

      {/* Footer */}
      <div className="footer-content-bottom mt-6">
        <a
          href="https://aphcom.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Powered by AphCom — opens aphcom.com in a new tab"
          className="aphcom-link"
        >
          <span>Powered by</span>
          <span className="aphcom-word aphcom-animated">AphCom</span>
        </a>
      </div>
    </div>
  );
}
