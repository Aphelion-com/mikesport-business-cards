"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AppSettings } from "@prisma/client";
import { Loader2, Save } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import Toast, { type ToastState } from "@/components/admin/Toast";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function SettingsForm({ settings }: { settings: AppSettings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    logoUrl: settings.logoUrl ?? "",
    dashboardTitle: settings.dashboardTitle ?? "Mike Sport Cards",
    accentColor: settings.accentColor ?? "#f97316",
    companyWebsite: settings.companyWebsite ?? "",
    defaultAddress: settings.defaultAddress ?? "",
    defaultCompanyPhone: settings.defaultCompanyPhone ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setToast({
          message: data.error || "Failed to save settings.",
          variant: "error",
        });
        return;
      }
      setToast({ message: "Settings saved.", variant: "success" });
      router.refresh();
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Branding
        </h2>

        <div className="mt-4">
          <span className="text-sm font-medium text-slate-700">
            Dashboard logo
          </span>
          <p className="mb-2 text-xs text-slate-400">
            Shown in the sidebar & header. If empty, the text logo is used.
          </p>
          <ImageUpload
            value={form.logoUrl}
            onChange={(url) => update("logoUrl", url)}
            label="Logo"
            onError={(msg) => setToast({ message: msg, variant: "error" })}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Dashboard title (fallback)
            </span>
            <input
              className={inputClass}
              value={form.dashboardTitle}
              onChange={(e) => update("dashboardTitle", e.target.value)}
              placeholder="Mike Sport Cards"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Brand accent color
            </span>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="color"
                value={form.accentColor}
                onChange={(e) => update("accentColor", e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                aria-label="Accent color picker"
              />
              <input
                className={inputClass + " mt-0"}
                value={form.accentColor}
                onChange={(e) => update("accentColor", e.target.value)}
                placeholder="#f97316"
              />
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Company defaults
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Company website
            </span>
            <input
              className={inputClass}
              value={form.companyWebsite}
              onChange={(e) => update("companyWebsite", e.target.value)}
              placeholder="https://www.mikesport.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Default address
            </span>
            <input
              className={inputClass}
              value={form.defaultAddress}
              onChange={(e) => update("defaultAddress", e.target.value)}
              placeholder="Head Office - Zalka Highway"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Default company phone
            </span>
            <input
              className={inputClass}
              value={form.defaultCompanyPhone}
              onChange={(e) => update("defaultCompanyPhone", e.target.value)}
              placeholder="+9611888855"
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </button>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </form>
  );
}
