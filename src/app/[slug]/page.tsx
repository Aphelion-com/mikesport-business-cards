import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Phone,
  Smartphone,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettingsSafe } from "@/lib/settings";
import SaveContactButton from "@/components/SaveContactButton";
import TrackPageView from "@/components/TrackPageView";
import Wordmark from "@/components/Wordmark";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

async function getCard(slug: string) {
  return prisma.card.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await getCard(params.slug);
  if (!card) return { title: "Card not found — Mike Sport" };
  return {
    title: `${card.fullName} — Mike Sport`,
    description:
      card.description ||
      `${card.position} at ${card.companyName}. Save contact details.`,
    openGraph: {
      title: `${card.fullName} — Mike Sport`,
      description: card.description || `${card.position} at ${card.companyName}`,
      images: card.profileImageUrl ? [card.profileImageUrl] : undefined,
    },
  };
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.5c.26 0 .51.04.75.11V9.8a5.6 5.6 0 1 0 4.85 5.55V9.01a7.36 7.36 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.15-1.48Z" />
    </svg>
  );
}

// eslint-disable-next-line @next/next/no-img-element
const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...p} alt={p.alt ?? ""} />;

function Emblem({
  src,
  className,
}: {
  src?: string | null;
  className?: string;
}) {
  if (src) {
    return <Img src={src} alt="Mike Sport" className={className} />;
  }
  return <Wordmark className="!text-base" />;
}

function ContactRow({
  icon,
  label,
  value,
  href,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay: number;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-graphite text-brand-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
        <p className="truncate text-[15px] font-semibold text-graphite">{value}</p>
      </div>
    </div>
  );
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      {href ? (
        <a href={href} className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      {/* Soft moving background blobs */}
      <div
        className="pointer-events-none absolute -left-24 top-[-60px] h-72 w-72 animate-blob-1 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #f58220 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 animate-blob-2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #c99a4a 0%, transparent 70%)" }}
      />
      {/* Subtle diagonal texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #111 0 1px, transparent 1px 24px)",
        }}
      />
      <div className="relative mx-auto max-w-md px-4 py-8">{children}</div>
    </main>
  );
}

export default async function PublicCardPage({ params }: Props) {
  const card = await getCard(params.slug);
  if (!card) notFound();

  const settings = await getSettingsSafe();
  const emblemSrc =
    settings.showEmblemOnCards
      ? settings.cardEmblemUrl || settings.logoUrl || null
      : null;
  const emblemPosition = settings.emblemPosition || "top";

  // Exists but deactivated -> polished "unavailable" screen.
  if (!card.isActive) {
    return (
      <Shell>
        <div className="flex min-h-[80vh] flex-col items-center justify-center">
          <div className="w-full animate-scale-in rounded-4xl border border-black/5 bg-white p-8 text-center shadow-card">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-graphite text-brand-500">
              <Clock className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-graphite">
              Card unavailable
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              This Mike Sport business card is currently inactive. Please check
              back later or contact the team directly.
            </p>
            <div className="mt-6 flex justify-center">
              <Emblem src={emblemSrc} className="h-9 w-auto max-w-[160px] object-contain" />
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  const socials = [
    { url: card.linkedinUrl, icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
    { url: card.instagramUrl, icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { url: card.facebookUrl, icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { url: card.tiktokUrl, icon: <TikTokIcon className="h-5 w-5" />, label: "TikTok" },
  ].filter((s) => s.url);

  let d = 0;
  const next = () => (d += 70);
  const location = card.address || card.officeLocation;

  return (
    <Shell>
      <TrackPageView slug={card.slug} />

      {/* Emblem — top position */}
      {emblemPosition === "top" && (
        <div className="mb-5 flex animate-fade-in justify-center">
          <Emblem
            src={emblemSrc}
            className="h-10 w-auto max-w-[180px] object-contain"
          />
        </div>
      )}

      {/* Card */}
      <div className="overflow-hidden rounded-4xl border border-black/5 bg-white/90 shadow-card backdrop-blur">
        {/* Orange accent + optional header emblem */}
        <div className="relative h-2 bg-gradient-to-r from-brand-500 via-brand-400 to-gold" />
        {emblemPosition === "header" && (
          <div className="flex animate-fade-in justify-center pt-5">
            <Emblem
              src={emblemSrc}
              className="h-8 w-auto max-w-[160px] object-contain"
            />
          </div>
        )}

        <div className="px-6 pb-7 pt-6">
          {/* Avatar */}
          <div className="flex animate-scale-in justify-center">
            {card.profileImageUrl ? (
              <Img
                src={card.profileImageUrl}
                alt={card.profileImageAlt || card.fullName}
                className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-brand-500"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-graphite text-3xl font-extrabold text-brand-500 shadow-lg ring-2 ring-brand-500">
                {initials(card.fullName)}
              </div>
            )}
          </div>

          {/* Name + title */}
          <div className="mt-4 text-center">
            <h1
              className="animate-fade-in-up text-2xl font-bold tracking-tight text-graphite"
              style={{ animationDelay: "80ms" }}
            >
              {card.fullName}
            </h1>
            <div
              className="mt-2 flex animate-fade-in-up flex-wrap items-center justify-center gap-2"
              style={{ animationDelay: "140ms" }}
            >
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                {card.position}
              </span>
              {card.department && (
                <span className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-slate-600">
                  {card.department}
                </span>
              )}
            </div>
            {card.companyName && (
              <p
                className="mt-2 animate-fade-in-up text-sm font-medium text-slate-400"
                style={{ animationDelay: "180ms" }}
              >
                {card.companyName}
              </p>
            )}
          </div>

          {/* Bio */}
          {card.description && (
            <p
              className="mt-4 animate-fade-in-up text-center text-sm leading-relaxed text-slate-600"
              style={{ animationDelay: "220ms" }}
            >
              {card.description}
            </p>
          )}

          {/* Contact rows */}
          <div className="mt-6 space-y-2.5">
            <ContactRow
              icon={<Smartphone className="h-5 w-5" />}
              label="Mobile"
              value={card.mobilePhone}
              href={`tel:${card.mobilePhone}`}
              delay={(next(), 260 + d)}
            />
            {card.companyPhone && (
              <ContactRow
                icon={<Phone className="h-5 w-5" />}
                label="Company"
                value={
                  card.extension
                    ? `${card.companyPhone} · ext ${card.extension}`
                    : card.companyPhone
                }
                href={`tel:${card.companyPhone}${
                  card.extension ? `,${card.extension}` : ""
                }`}
                delay={(next(), 260 + d)}
              />
            )}
            <ContactRow
              icon={<Mail className="h-5 w-5" />}
              label="Email"
              value={card.email}
              href={`mailto:${card.email}`}
              delay={(next(), 260 + d)}
            />
            {card.website && (
              <ContactRow
                icon={<Globe className="h-5 w-5" />}
                label="Website"
                value={card.website.replace(/^https?:\/\//, "")}
                href={card.website}
                delay={(next(), 260 + d)}
              />
            )}
            {location && (
              <ContactRow
                icon={<MapPin className="h-5 w-5" />}
                label="Location"
                value={location}
                href={`https://maps.google.com/?q=${encodeURIComponent(location)}`}
                delay={(next(), 260 + d)}
              />
            )}
          </div>

          {/* Social links */}
          {socials.length > 0 && (
            <div
              className="mt-6 flex animate-fade-in-up justify-center gap-3"
              style={{ animationDelay: `${260 + d + 70}ms` }}
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-sand text-graphite transition hover:bg-brand-500 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div
            className="mt-7 animate-fade-in-up space-y-2.5"
            style={{ animationDelay: `${260 + d + 140}ms` }}
          >
            <SaveContactButton slug={card.slug} />
            <div className="grid grid-cols-3 gap-2.5">
              <a
                href={`tel:${card.mobilePhone}`}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm font-semibold text-graphite transition hover:border-brand-300 hover:bg-brand-50"
              >
                <Phone className="h-4 w-4 text-brand-600" /> Call
              </a>
              <a
                href={`mailto:${card.email}`}
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm font-semibold text-graphite transition hover:border-brand-300 hover:bg-brand-50"
              >
                <Mail className="h-4 w-4 text-brand-600" /> Email
              </a>
              <a
                href={card.website || "#"}
                target={card.website ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-disabled={!card.website}
                className={`flex items-center justify-center gap-1.5 rounded-2xl border border-black/10 px-3 py-3 text-sm font-semibold transition ${
                  card.website
                    ? "bg-white text-graphite hover:border-brand-300 hover:bg-brand-50"
                    : "pointer-events-none bg-slate-50 text-slate-300"
                }`}
              >
                <Globe className="h-4 w-4 text-brand-600" /> Web
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex flex-col items-center gap-1">
        {emblemPosition === "footer" ? (
          <Emblem src={emblemSrc} className="h-8 w-auto max-w-[150px] object-contain" />
        ) : (
          <Wordmark className="opacity-80" />
        )}
        <p className="text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {card.companyName || "Mike Sport"}. All
          rights reserved.
        </p>
      </div>
    </Shell>
  );
}
