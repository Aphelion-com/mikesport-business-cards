"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Card } from "@prisma/client";
import { Loader2, ArrowLeft, Save, Link2 } from "lucide-react";
import { slugify } from "@/lib/slug";

type Mode = "create" | "edit";

type FormState = {
  fullName: string;
  slug: string;
  position: string;
  mobilePhone: string;
  companyPhone: string;
  extension: string;
  email: string;
  website: string;
  address: string;
  profileImageUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  isActive: boolean;
};

function fromCard(card?: Card): FormState {
  return {
    fullName: card?.fullName ?? "",
    slug: card?.slug ?? "",
    position: card?.position ?? "",
    mobilePhone: card?.mobilePhone ?? "",
    companyPhone: card?.companyPhone ?? "",
    extension: card?.extension ?? "",
    email: card?.email ?? "",
    website: card?.website ?? "",
    address: card?.address ?? "",
    profileImageUrl: card?.profileImageUrl ?? "",
    linkedinUrl: card?.linkedinUrl ?? "",
    instagramUrl: card?.instagramUrl ?? "",
    facebookUrl: card?.facebookUrl ?? "",
    tiktokUrl: card?.tiktokUrl ?? "",
    isActive: card?.isActive ?? true,
  };
}

function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export default function CardForm({
  mode,
  card,
  baseUrl,
}: {
  mode: Mode;
  card?: Card;
  baseUrl: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(fromCard(card));
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onFullNameChange(value: string) {
    setForm((f) => ({
      ...f,
      fullName: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const payload = {
      ...form,
      // normalize empty optional strings to undefined handled server-side
    };

    const endpoint =
      mode === "create" ? "/api/cards" : `/api/cards/${card!.slug}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.issues?.fieldErrors) {
          setFieldErrors(data.issues.fieldErrors);
        }
        setError(data.error || "Failed to save card.");
        setLoading(false);
        return;
      }

      router.push("/admin/cards");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  const publicUrl = `${baseUrl.replace(/\/$/, "")}/${form.slug || ""}`;

  function err(name: string) {
    return fieldErrors[name]?.[0];
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* Identity */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Identity
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Rawad Halloun"
              required
            />
            {err("fullName") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("fullName")}
              </span>
            )}
          </Field>

          <Field label="Position" required>
            <input
              className={inputClass}
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
              placeholder="Retail Director"
              required
            />
            {err("position") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("position")}
              </span>
            )}
          </Field>
        </div>

        <div className="mt-4">
          <Field
            label="Slug (public URL)"
            required
            hint="Auto-generated from the full name. Edit to customise."
          >
            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
              <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                className="w-full bg-transparent py-2.5 text-sm outline-none"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", slugify(e.target.value));
                }}
                placeholder="rawad-halloun"
                required
              />
            </div>
            {err("slug") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("slug")}
              </span>
            )}
          </Field>
          <p className="mt-2 break-all text-xs text-brand-600">{publicUrl}</p>
        </div>

        <div className="mt-4">
          <Field label="Profile image URL" hint="Leave empty to use initials avatar.">
            <input
              className={inputClass}
              value={form.profileImageUrl}
              onChange={(e) => update("profileImageUrl", e.target.value)}
              placeholder="https://…/photo.jpg"
            />
            {err("profileImageUrl") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("profileImageUrl")}
              </span>
            )}
          </Field>
        </div>
      </section>

      {/* Contact */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Contact
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Mobile phone" required>
            <input
              className={inputClass}
              value={form.mobilePhone}
              onChange={(e) => update("mobilePhone", e.target.value)}
              placeholder="+96179409364"
              required
            />
            {err("mobilePhone") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("mobilePhone")}
              </span>
            )}
          </Field>

          <Field label="Company phone">
            <input
              className={inputClass}
              value={form.companyPhone}
              onChange={(e) => update("companyPhone", e.target.value)}
              placeholder="+9611888855"
            />
          </Field>

          <Field label="Extension">
            <input
              className={inputClass}
              value={form.extension}
              onChange={(e) => update("extension", e.target.value)}
              placeholder="1560"
            />
          </Field>

          <Field label="Email" required>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@mikesport.com"
              required
            />
            {err("email") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("email")}
              </span>
            )}
          </Field>

          <Field label="Website">
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://www.mikesport.com"
            />
            {err("website") && (
              <span className="mt-1 block text-xs text-red-500">
                {err("website")}
              </span>
            )}
          </Field>

          <Field label="Address">
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Head Office - Zalka Highway"
            />
          </Field>
        </div>
      </section>

      {/* Social */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Social links <span className="font-normal lowercase">(optional)</span>
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL">
            <input
              className={inputClass}
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className={inputClass}
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/…"
            />
          </Field>
          <Field label="Facebook URL">
            <input
              className={inputClass}
              value={form.facebookUrl}
              onChange={(e) => update("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/…"
            />
          </Field>
          <Field label="TikTok URL">
            <input
              className={inputClass}
              value={form.tiktokUrl}
              onChange={(e) => update("tiktokUrl", e.target.value)}
              placeholder="https://tiktok.com/@…"
            />
          </Field>
        </div>
      </section>

      {/* Status */}
      <section className="flex items-center justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Active</h2>
          <p className="text-xs text-slate-400">
            Inactive cards return a 404 on their public page.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.isActive}
          onClick={() => update("isActive", !form.isActive)}
          className={`relative h-7 w-12 rounded-full transition ${
            form.isActive ? "bg-brand-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
              form.isActive ? "left-6" : "left-1"
            }`}
          />
        </button>
      </section>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/cards"
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "create" ? "Create Card" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
