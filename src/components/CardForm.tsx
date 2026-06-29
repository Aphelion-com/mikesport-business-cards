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
} from "lucide-react";
import { slugify } from "@/lib/slug";
import ImageUpload from "@/components/admin/ImageUpload";
import Toast, { type ToastState } from "@/components/admin/Toast";

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
  facebookUrl: string;
  tiktokUrl: string;
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
    facebookUrl: card?.facebookUrl ?? "",
    tiktokUrl: card?.tiktokUrl ?? "",
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

      {/* Social links */}
      <Section
        icon={<Share2 className="h-5 w-5" />}
        title="Social links"
        subtitle="Optional"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn URL" error={err("linkedinUrl")}>
            <input
              className={inputClass}
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/…"
            />
          </Field>
          <Field label="Instagram URL" error={err("instagramUrl")}>
            <input
              className={inputClass}
              value={form.instagramUrl}
              onChange={(e) => update("instagramUrl", e.target.value)}
              placeholder="https://instagram.com/…"
            />
          </Field>
          <Field label="Facebook URL" error={err("facebookUrl")}>
            <input
              className={inputClass}
              value={form.facebookUrl}
              onChange={(e) => update("facebookUrl", e.target.value)}
              placeholder="https://facebook.com/…"
            />
          </Field>
          <Field label="TikTok URL" error={err("tiktokUrl")}>
            <input
              className={inputClass}
              value={form.tiktokUrl}
              onChange={(e) => update("tiktokUrl", e.target.value)}
              placeholder="https://tiktok.com/@…"
            />
          </Field>
        </div>
      </Section>

      {/* Status */}
      <Section icon={<ToggleRight className="h-5 w-5" />} title="Status">
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
