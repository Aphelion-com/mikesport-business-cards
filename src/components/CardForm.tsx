"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Card } from "@prisma/client";
import {
  Loader2,
  ArrowLeft,
  Save,
  Link2,
  User,
  Phone,
  ImageIcon,
  Share2,
  FileText,
  ToggleRight,
  Linkedin,
  Instagram,
  Facebook,
} from "lucide-react";
import { slugify } from "@/lib/slug";
import ImageUpload from "@/components/admin/ImageUpload";
import Toast, { type ToastState } from "@/components/admin/Toast";

function XGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.5c.26 0 .51.04.75.11V9.8a5.6 5.6 0 1 0 4.85 5.55V9.01a7.36 7.36 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.15-1.48Z" />
    </svg>
  );
}

type Mode = "create" | "edit";

type FormState = {
  fullName: string;
  slug: string;
  position: string;
  department: string;
  companyName: string;
  officeLocation: string;
  description: string;
  mobilePhone: string;
  companyPhone: string;
  extension: string;
  email: string;
  website: string;
  address: string;
  profileImageUrl: string;
  profileImageAlt: string;
  linkedinUrl: string;
  instagramUrl: string;
  xUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  displayOrder: string;
  isActive: boolean;
};

function fromCard(card?: Card): FormState {
  return {
    fullName: card?.fullName ?? "",
    slug: card?.slug ?? "",
    position: card?.position ?? "",
    department: card?.department ?? "",
    companyName: card?.companyName ?? "Mike Sport",
    officeLocation: card?.officeLocation ?? "",
    description: card?.description ?? "",
    mobilePhone: card?.mobilePhone ?? "",
    companyPhone: card?.companyPhone ?? "",
    extension: card?.extension ?? "",
    email: card?.email ?? "",
    website: card?.website ?? "",
    address: card?.address ?? "",
    profileImageUrl: card?.profileImageUrl ?? "",
    profileImageAlt: card?.profileImageAlt ?? "",
    linkedinUrl: card?.linkedinUrl ?? "",
    instagramUrl: card?.instagramUrl ?? "",
    xUrl: card?.xUrl ?? "",
    facebookUrl: card?.facebookUrl ?? "",
    tiktokUrl: card?.tiktokUrl ?? "",
    displayOrder: card?.displayOrder != null ? String(card.displayOrder) : "0",
    isActive: card?.isActive ?? true,
  };
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

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
    setFieldErrors({});
    setLoading(true);

    const endpoint =
      mode === "create" ? "/api/cards" : `/api/cards/${card!.slug}`;
    const method = mode === "create" ? "POST" : "PATCH";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.issues?.fieldErrors) setFieldErrors(data.issues.fieldErrors);
        setToast({
          message:
            res.status === 409
              ? "That slug is already in use — choose a different one."
              : data.error || "Failed to save card.",
          variant: "error",
        });
        setLoading(false);
        return;
      }

      setToast({
        message: mode === "create" ? "Card created." : "Changes saved.",
        variant: "success",
      });
      // Brief pause so the toast is visible before navigating.
      setTimeout(() => {
        router.push("/admin/cards");
        router.refresh();
      }, 600);
    } catch {
      setToast({ message: "Network error. Please try again.", variant: "error" });
      setLoading(false);
    }
  }

  const publicUrl = `${baseUrl.replace(/\/$/, "")}/${form.slug || ""}`;
  const err = (name: string) => fieldErrors[name]?.[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <Section icon={<User className="h-5 w-5" />} title="Basic info">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={err("fullName")}>
            <input
              className={inputClass}
              value={form.fullName}
              onChange={(e) => onFullNameChange(e.target.value)}
              placeholder="Rawad Halloun"
              required
            />
          </Field>
          <Field label="Position" required error={err("position")}>
            <input
              className={inputClass}
              value={form.position}
              onChange={(e) => update("position", e.target.value)}
              placeholder="Retail Director"
              required
            />
          </Field>
          <Field label="Department" error={err("department")}>
            <input
              className={inputClass}
              value={form.department}
              onChange={(e) => update("department", e.target.value)}
              placeholder="Retail"
            />
          </Field>
          <Field label="Company name" error={err("companyName")}>
            <input
              className={inputClass}
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Mike Sport"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Slug (public URL)" required error={err("slug")}>
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
          </Field>
          <p className="mt-2 break-all text-xs">
            <span className="text-slate-400">Public URL: </span>
            <span className="font-medium text-brand-600">{publicUrl}</span>
          </p>
        </div>
      </Section>

      {/* Contact info */}
      <Section icon={<Phone className="h-5 w-5" />} title="Contact info">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile phone" required error={err("mobilePhone")}>
            <input
              className={inputClass}
              value={form.mobilePhone}
              onChange={(e) => update("mobilePhone", e.target.value)}
              placeholder="+96179409364"
              required
            />
          </Field>
          <Field label="Company phone" error={err("companyPhone")}>
            <input
              className={inputClass}
              value={form.companyPhone}
              onChange={(e) => update("companyPhone", e.target.value)}
              placeholder="+9611888855"
            />
          </Field>
          <Field label="Extension" error={err("extension")}>
            <input
              className={inputClass}
              value={form.extension}
              onChange={(e) => update("extension", e.target.value)}
              placeholder="1560"
            />
          </Field>
          <Field label="Email" required error={err("email")}>
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@mikesport.com"
              required
            />
          </Field>
          <Field label="Website" error={err("website")}>
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://www.mikesport.com"
            />
          </Field>
          <Field label="Address" error={err("address")}>
            <input
              className={inputClass}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Head Office - Zalka Highway"
            />
          </Field>
          <Field label="Office location" error={err("officeLocation")}>
            <input
              className={inputClass}
              value={form.officeLocation}
              onChange={(e) => update("officeLocation", e.target.value)}
              placeholder="Head Office - Zalka Highway"
            />
          </Field>
        </div>
      </Section>

      {/* Profile image */}
      <Section
        icon={<ImageIcon className="h-5 w-5" />}
        title="Profile image"
        subtitle="Upload a photo or paste a URL. Empty = initials avatar."
      >
        <ImageUpload
          value={form.profileImageUrl}
          onChange={(url) => update("profileImageUrl", url)}
          rounded
          label="Profile"
          onError={(msg) => setToast({ message: msg, variant: "error" })}
        />
        <div className="mt-4">
          <Field label="Image alt text" error={err("profileImageAlt")}>
            <input
              className={inputClass}
              value={form.profileImageAlt}
              onChange={(e) => update("profileImageAlt", e.target.value)}
              placeholder="Photo of Rawad Halloun"
            />
          </Field>
        </div>
      </Section>

      {/* Description */}
      <Section
        icon={<FileText className="h-5 w-5" />}
        title="Card description"
        subtitle="A short professional bio shown on the public card."
      >
        <Field label="Description" error={err("description")}>
          <textarea
            className={inputClass + " min-h-[96px] resize-y"}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            maxLength={600}
            placeholder="Retail Director at Mike Sport, leading retail operations…"
          />
        </Field>
        <p className="mt-1 text-right text-xs text-slate-400">
          {form.description.length}/600
        </p>
      </Section>

      {/* Social Links */}
      <Section
        icon={<Share2 className="h-5 w-5" />}
        title="Social Links"
        subtitle="Optional — only filled links appear on the public card"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL" error={err("linkedinUrl")}>
            <input
              className={inputClass}
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://www.linkedin.com/in/name"
            />
          </Field>
          <Field label="Instagram URL" error={err("instagramUrl")}>
            <input
              className={inputClass}
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              placeholder="https://www.instagram.com/name"
            />
          </Field>
          <Field label="X URL" error={err("xUrl")}>
            <input
              className={inputClass}
              value={form.xUrl}
              onChange={(e) => update("xUrl", e.target.value)}
              placeholder="https://x.com/name"
            />
          </Field>
          <Field label="Facebook URL" error={err("facebookUrl")}>
            <input
              className={inputClass}
              value={form.facebookUrl}
              onChange={(e) => update("facebookUrl", e.target.value)}
              placeholder="https://www.facebook.com/name"
            />
          </Field>
          <Field label="TikTok URL" error={err("tiktokUrl")}>
            <input
              className={inputClass}
              value={form.tiktokUrl}
              onChange={(e) => update("tiktokUrl", e.target.value)}
              placeholder="https://www.tiktok.com/@name"
            />
          </Field>
        </div>

        {/* Filled-icon preview */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-slate-400">Preview:</span>
          {[
            { on: !!form.linkedinUrl.trim(), icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
            { on: !!form.instagramUrl.trim(), icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
            { on: !!form.xUrl.trim(), icon: <XGlyph className="h-3.5 w-3.5" />, label: "X" },
            { on: !!form.facebookUrl.trim(), icon: <Facebook className="h-4 w-4" />, label: "Facebook" },
            { on: !!form.tiktokUrl.trim(), icon: <TikTokGlyph className="h-4 w-4" />, label: "TikTok" },
          ].map((s) => (
            <span
              key={s.label}
              title={s.label}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                s.on
                  ? "border-brand-300 bg-brand-50 text-brand-600"
                  : "border-slate-200 text-slate-300"
              }`}
            >
              {s.icon}
            </span>
          ))}
        </div>
      </Section>

      {/* Status & ordering */}
      <Section icon={<ToggleRight className="h-5 w-5" />} title="Status & ordering">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Inactive cards show a polished “unavailable” page publicly.
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={form.isActive}
            onClick={() => update("isActive", !form.isActive)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              form.isActive ? "bg-brand-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                form.isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
        <div className="mt-4 max-w-xs">
          <Field label="Display order" error={err("displayOrder")}>
            <input
              type="number"
              className={inputClass}
              value={form.displayOrder}
              onChange={(e) => update("displayOrder", e.target.value)}
              placeholder="0"
            />
          </Field>
          <p className="mt-1 text-xs text-slate-400">
            Lower numbers appear first in the dashboard list.
          </p>
        </div>
      </Section>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
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
          className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-2.5 text-sm font-semibold text-ink-950 transition hover:bg-brand-400 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "create" ? "Create Card" : "Save Changes"}
        </button>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </form>
  );
}
