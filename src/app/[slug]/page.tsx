import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Phone,
  Smartphone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Briefcase,
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

const Img = (p: React.ImgHTMLAttributes<HTMLImageElement>) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img {...p} alt={p.alt ?? ""} />
);

function Emblem({ src, className }: { src?: string | null; className?: string }) {
  if (src) return <Img src={src} alt="Mike Sport" className={className} />;
  return <Wordmark className="!text-base" />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="h-px flex-1 bg-warmborder" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
        {children}
      </span>
      <span className="h-px flex-1 bg-warmborder" />
    </div>
  );
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
    <div className="flex items-center gap-4 rounded-2xl border border-warmborder bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-warmborder bg-sand text-brand-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
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

function PillButton({
  href,
  icon,
  label,
  target,
  disabled,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  target?: boolean;
  disabled?: boolean;
}) {
  return (
    <a
      href={disabled ? "#" : href}
      target={target ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-disabled={disabled}
      className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-3 text-sm font-semibold transition ${
        disabled
          ? "pointer-events-none border-warmborder bg-sand/60 text-slate-300"
          : "border-warmborder bg-white text-graphite hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-paper">
      <div
        className="pointer-events-none absolute -left-28 top-[-80px] h-72 w-72 animate-blob-1 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-28 top-1/3 h-80 w-80 animate-blob-2 rounded-full opacity-15 blur-3xl"
        style={{ background: "radial-gradient(circle, #c99a4a 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #111 0 1px, transparent 1px 26px)",
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
  const emblemSrc = settings.showEmblemOnCards
    ? settings.cardEmblemUrl || settings.logoUrl || null
    : null;
  const emblemPosition = settings.emblemPosition || "top";
  const firstName = card.fullName.split(/\s+/)[0];

  // Inactive -> branded unavailable page.
  if (!card.isActive) {
    return (
      <Shell>
        <div className="flex min-h-[80vh] flex-col items-center justify-center">
          <div className="w-full animate-scale-in rounded-4xl border border-warmborder bg-white p-8 text-center shadow-card">
            <div className="flex justify-center">
              <Emblem src={emblemSrc} className="h-9 w-auto max-w-[170px] object-contain" />
            </div>
            <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-warmborder bg-sand text-brand-600">
              <Clock className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-xl font-bold text-graphite">
              Card unavailable
            </h1>
            <p className="mt-2 text-sm text-muted">
              This digital business card is currently unavailable. Please check
              back later or contact the team directly.
            </p>
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

  // Professional details rows (only those present)
  const proDetails = [
    { icon: <Briefcase className="h-4 w-4" />, label: "Position", value: card.position },
    { icon: <Building2 className="h-4 w-4" />, label: "Department", value: card.department },
    { icon: <Building2 className="h-4 w-4" />, label: "Company", value: card.companyName },
    { icon: <MapPin className="h-4 w-4" />, label: "Office", value: card.officeLocation },
  ].filter((r) => r.value);

  return (
    <Shell>
      <TrackPageView slug={card.slug} />

      {/* A. Brand intro */}
      {emblemPosition === "top" && (
        <div className="mb-6 flex animate-fade-in flex-col items-center gap-2">
          <Emblem src={emblemSrc} className="h-10 w-auto max-w-[180px] object-contain" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Digital Business Card
          </span>
        </div>
      )}

      {/* Card */}
      <div className="overflow-hidden rounded-4xl border border-warmborder bg-white/90 shadow-card backdrop-blur">
        <div className="h-1.5 bg-gradient-to-r from-brand-500 via-brand-400 to-gold" />
        {emblemPosition === "header" && (
          <div className="flex animate-fade-in justify-center pt-5">
            <Emblem src={emblemSrc} className="h-8 w-auto max-w-[160px] object-contain" />
          </div>
        )}

        <div className="px-6 pb-7 pt-7">
          {/* B. Hero */}
          <div className="flex animate-scale-in justify-center">
            <div className="rounded-full bg-gradient-to-br from-brand-500 to-gold p-[3px] shadow-lg">
              {card.profileImageUrl ? (
                <Img
                  src={card.profileImageUrl}
                  alt={card.profileImageAlt || card.fullName}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-graphite text-3xl font-extrabold text-brand-500">
                  {initials(card.fullName)}
                </div>
              )}
            </div>
          </div>

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
                <span className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-muted">
                  {card.department}
                </span>
              )}
            </div>
            {card.companyName && (
              <p
                className="mt-2 animate-fade-in-up text-sm font-medium text-muted"
                style={{ animationDelay: "180ms" }}
              >
                {card.companyName}
              </p>
            )}
            {card.description && (
              <p
                className="mt-4 animate-fade-in-up text-center text-sm leading-relaxed text-slate-600"
                style={{ animationDelay: "220ms" }}
              >
                {card.description}
              </p>
            )}
          </div>

          {/* C. Quick actions */}
          <div
            className="mt-7 animate-fade-in-up"
            style={{ animationDelay: "260ms" }}
          >
            <h2 className="mb-3 text-center text-sm font-bold text-graphite">
              Connect with {firstName}
            </h2>
            <SaveContactButton slug={card.slug} />
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              <PillButton
                href={`tel:${card.mobilePhone}`}
                icon={<Phone className="h-4 w-4 text-brand-600" />}
                label="Call"
              />
              <PillButton
                href={`mailto:${card.email}`}
                icon={<Mail className="h-4 w-4 text-brand-600" />}
                label="Email"
              />
              <PillButton
                href={card.website || "#"}
                icon={<Globe className="h-4 w-4 text-brand-600" />}
                label="Web"
                target={!!card.website}
                disabled={!card.website}
              />
            </div>
          </div>

          {/* D. Contact information */}
          <div className="mt-8">
            <SectionHeading>Contact Information</SectionHeading>
            <div className="space-y-2.5">
              <ContactRow
                icon={<Smartphone className="h-5 w-5" />}
                label="Mobile"
                value={card.mobilePhone}
                href={`tel:${card.mobilePhone}`}
                delay={(next(), 300 + d)}
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
                  delay={(next(), 300 + d)}
                />
              )}
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={card.email}
                href={`mailto:${card.email}`}
                delay={(next(), 300 + d)}
              />
              {card.website && (
                <ContactRow
                  icon={<Globe className="h-5 w-5" />}
                  label="Website"
                  value={card.website.replace(/^https?:\/\//, "")}
                  href={card.website}
                  delay={(next(), 300 + d)}
                />
              )}
              {location && (
                <ContactRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Location"
                  value={location}
                  href={`https://maps.google.com/?q=${encodeURIComponent(location)}`}
                  delay={(next(), 300 + d)}
                />
              )}
            </div>
          </div>

          {/* E. Professional details */}
          {proDetails.length > 0 && (
            <div
              className="mt-8 animate-fade-in-up"
              style={{ animationDelay: `${300 + d + 60}ms` }}
            >
              <SectionHeading>Professional Details</SectionHeading>
              <div className="rounded-2xl border border-warmborder bg-sand/50 p-4">
                <dl className="space-y-3">
                  {proDetails.map((r) => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-warmborder bg-white text-brand-600">
                        {r.icon}
                      </span>
                      <div className="min-w-0">
                        <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                          {r.label}
                        </dt>
                        <dd className="truncate text-sm font-medium text-graphite">
                          {r.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* F. Social */}
          {socials.length > 0 && (
            <div
              className="mt-8 animate-fade-in-up"
              style={{ animationDelay: `${300 + d + 120}ms` }}
            >
              <SectionHeading>Follow Mike Sport</SectionHeading>
              <div className="flex justify-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-warmborder bg-white text-graphite transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-500 hover:text-white hover:shadow-md"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* G. Footer */}
      <div className="mt-6 flex flex-col items-center gap-1.5">
        {emblemPosition === "footer" ? (
          <Emblem src={emblemSrc} className="h-8 w-auto max-w-[150px] object-contain" />
        ) : (
          <Wordmark className="opacity-80" />
        )}
        {(card.website || settings.companyWebsite) && (
          <a
            href={(card.website || settings.companyWebsite) as string}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-brand-700 hover:text-brand-800"
          >
            {(card.website || settings.companyWebsite)!.replace(/^https?:\/\//, "")}
          </a>
        )}
        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} {card.companyName || "Mike Sport"}. All
          rights reserved.
        </p>
      </div>
    </Shell>
  );
}
