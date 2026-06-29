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
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSettingsSafe } from "@/lib/settings";
import SaveContactButton from "@/components/SaveContactButton";
import TrackPageView from "@/components/TrackPageView";
import Wordmark from "@/components/Wordmark";
import PublicCardExperience from "@/components/public/PublicCardExperience";
import AnimatedBackground from "@/components/public/AnimatedBackground";
import Reveal from "@/components/public/Reveal";
import StickySaveContact from "@/components/public/StickySaveContact";
import AphComFooter from "@/components/public/AphComFooter";

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

function BrandMark({ src, label }: { src?: string | null; label?: string | null }) {
  return src ? (
    <Img
      src={src}
      alt={label || "Mike Sport"}
      className="h-[72px] w-auto max-w-[260px] object-contain sm:h-[104px]"
    />
  ) : (
    <Wordmark className="!text-2xl sm:!text-3xl" />
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-sm font-bold tracking-tight text-graphite">{children}</span>
      <span className="accent-line h-[2px] flex-1 rounded-full opacity-70" />
    </div>
  );
}

function ContactTile({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="group flex h-full items-center gap-3.5 rounded-2xl border border-warmborder bg-white/80 px-4 py-3.5 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-warmborder bg-cream text-brand-600 transition duration-300 group-hover:scale-105 group-hover:border-brand-300 group-hover:bg-brand-50">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="truncate text-[15px] font-semibold text-graphite">{value}</p>
      </div>
      {href && (
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition duration-300 group-hover:translate-x-0.5 group-hover:text-brand-500" />
      )}
    </div>
  );
  return href ? (
    <a href={href} className="block h-full">
      {inner}
    </a>
  ) : (
    inner
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
      className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-2.5 text-sm font-semibold transition duration-300 active:scale-95 ${
        disabled
          ? "pointer-events-none border-warmborder bg-cream/60 text-slate-300"
          : "border-warmborder bg-white text-graphite hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50 hover:shadow-md"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}

export default async function PublicCardPage({ params }: Props) {
  const card = await getCard(params.slug);
  if (!card) notFound();

  const settings = await getSettingsSafe();
  const emblemSrc = settings.showEmblemOnCards
    ? settings.cardEmblemUrl || settings.logoUrl || null
    : null;
  const firstName = card.fullName.split(/\s+/)[0];

  // Inactive -> branded unavailable page.
  if (!card.isActive) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-paper px-4">
        <AnimatedBackground />
        <div className="relative w-full max-w-sm animate-scale-in rounded-[28px] border border-warmborder bg-white/85 p-8 text-center shadow-card backdrop-blur-md">
          <div className="flex justify-center">
            <BrandMark src={emblemSrc} label={card.companyName} />
          </div>
          <div className="mx-auto mt-6 flex h-14 w-14 items-center justify-center rounded-full border border-warmborder bg-cream text-brand-600">
            <Clock className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-graphite">Card unavailable</h1>
          <p className="mt-2 text-sm text-muted">
            This digital business card is currently unavailable. Please check
            back later or contact the team directly.
          </p>
          <AphComFooter company={card.companyName} />
        </div>
      </main>
    );
  }

  const socials = [
    { url: card.linkedinUrl, icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
    { url: card.instagramUrl, icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { url: card.facebookUrl, icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { url: card.tiktokUrl, icon: <TikTokIcon className="h-5 w-5" />, label: "TikTok" },
  ].filter((s) => s.url);

  const location = card.address || card.officeLocation;

  const contactItems = [
    { key: "mobile", icon: <Smartphone className="h-5 w-5" />, label: "Mobile", value: card.mobilePhone, href: `tel:${card.mobilePhone}` },
    card.companyPhone && {
      key: "company",
      icon: <Phone className="h-5 w-5" />,
      label: "Company",
      value: card.extension ? `${card.companyPhone} · ext ${card.extension}` : card.companyPhone,
      href: `tel:${card.companyPhone}${card.extension ? `,${card.extension}` : ""}`,
    },
    { key: "email", icon: <Mail className="h-5 w-5" />, label: "Email", value: card.email, href: `mailto:${card.email}` },
    card.website && {
      key: "website",
      icon: <Globe className="h-5 w-5" />,
      label: "Website",
      value: card.website.replace(/^https?:\/\//, ""),
      href: card.website,
    },
    location && {
      key: "location",
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: location,
      href: `https://maps.google.com/?q=${encodeURIComponent(location)}`,
    },
  ].filter(Boolean) as {
    key: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    href: string;
  }[];

  const snapshot = [
    { icon: <Briefcase className="h-4 w-4" />, label: "Position", value: card.position },
    { icon: <Building2 className="h-4 w-4" />, label: "Department", value: card.department },
    { icon: <Building2 className="h-4 w-4" />, label: "Company", value: card.companyName },
    { icon: <MapPin className="h-4 w-4" />, label: "Office", value: card.officeLocation },
  ].filter((r) => r.value) as {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];

  return (
    <PublicCardExperience>
      <TrackPageView slug={card.slug} />

      {/* C. Main hero card — clean warm surface, no orange glow */}
      <div
        className="relative animate-fade-in-up overflow-hidden rounded-[32px] border backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #FBF8F3 100%)",
          borderColor: "rgba(228,217,206,0.8)",
          boxShadow:
            "0 24px 60px -30px rgba(25,25,25,0.30), 0 4px 14px -8px rgba(25,25,25,0.08)",
        }}
      >
        {/* Subtle warm header layer — barely-visible depth, no orange */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-cream/60 via-cream/25 to-transparent" />

        <div className="relative px-6 pb-8 pt-9 sm:px-8 sm:pt-10">
          {/* Centered emblem — no container, no line */}
          <div className="flex justify-center">
            <div className="animate-fade-in-down transition duration-500 hover:-translate-y-1">
              <BrandMark src={emblemSrc} label={card.companyName} />
            </div>
          </div>

          {/* Hero profile — clean thin double ring */}
          <div className="mt-6 flex justify-center">
            <div
              className="relative animate-scale-in"
              style={{ animationDelay: "60ms" }}
            >
              {/* gentle one-time ring pulse on load */}
              <span className="absolute inset-0 rounded-full ring-2 ring-brand-500/30 animate-ring-once" />
              <div className="rounded-full bg-brand-500 p-[2px] shadow-[0_14px_30px_-16px_rgba(25,25,25,0.45)]">
                <div className="rounded-full bg-white p-[3px]">
                  {card.profileImageUrl ? (
                    <Img
                      src={card.profileImageUrl}
                      alt={card.profileImageAlt || card.fullName}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-graphite text-4xl font-extrabold text-brand-500">
                      {initials(card.fullName)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <h1
              className="animate-fade-in-up text-[26px] font-bold leading-tight tracking-tight text-graphite"
              style={{ animationDelay: "120ms" }}
            >
              {card.fullName}
            </h1>
            <div
              className="mt-2.5 flex animate-fade-in-up flex-wrap items-center justify-center gap-2"
              style={{ animationDelay: "180ms" }}
            >
              <span className="rounded-full bg-brand-500 px-3.5 py-1 text-sm font-semibold text-white shadow-sm">
                {card.position}
              </span>
              {card.department && (
                <span className="rounded-full bg-cream px-3 py-1 text-sm font-medium text-muted ring-1 ring-warmborder">
                  {card.department}
                </span>
              )}
            </div>
            {card.companyName && (
              <p
                className="mt-2 animate-fade-in-up text-sm font-semibold text-graphite"
                style={{ animationDelay: "220ms" }}
              >
                {card.companyName}
              </p>
            )}
            {card.description && (
              <p
                className="mx-auto mt-4 max-w-md animate-fade-in-up px-2 text-center text-[14.5px] leading-relaxed text-slate-600"
                style={{ animationDelay: "260ms" }}
              >
                {card.description}
              </p>
            )}
          </div>

          {/* D. Quick actions */}
          <div className="mt-7 animate-fade-in-up" style={{ animationDelay: "320ms" }}>
            <h2 className="mb-3 text-center text-sm font-bold text-graphite">
              Connect with {firstName}
            </h2>
            <div id="hero-save">
              <SaveContactButton slug={card.slug} />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              <PillButton href={`tel:${card.mobilePhone}`} icon={<Phone className="h-4 w-4 text-brand-600" />} label="Call" />
              <PillButton href={`mailto:${card.email}`} icon={<Mail className="h-4 w-4 text-brand-600" />} label="Email" />
              <PillButton href={card.website || "#"} icon={<Globe className="h-4 w-4 text-brand-600" />} label="Web" target={!!card.website} disabled={!card.website} />
            </div>
          </div>
        </div>
      </div>

      {/* E. Contact section */}
      <div className="mt-9">
        <Reveal>
          <SectionHeading>Contact Information</SectionHeading>
        </Reveal>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {contactItems.map((c, i) => (
            <Reveal key={c.key} delay={i * 70}>
              <ContactTile icon={c.icon} label={c.label} value={c.value} href={c.href} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* F. Professional Snapshot (bento) */}
      {snapshot.length > 0 && (
        <div className="mt-9">
          <Reveal>
            <SectionHeading>Professional Snapshot</SectionHeading>
          </Reveal>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {snapshot.map((r, i) => (
              <Reveal key={r.label} delay={i * 70}>
                <div className="h-full rounded-2xl border border-warmborder bg-gradient-to-br from-white to-cream/70 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-warmborder bg-white text-brand-600">
                    {r.icon}
                  </span>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {r.label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-graphite">{r.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* Social */}
      {socials.length > 0 && (
        <div className="mt-9">
          <Reveal>
            <SectionHeading>Follow Mike Sport</SectionHeading>
          </Reveal>
          <Reveal delay={80}>
            <div className="flex justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-warmborder bg-white text-graphite transition duration-300 hover:-translate-y-1 hover:rotate-3 hover:border-brand-300 hover:bg-brand-500 hover:text-white hover:shadow-lg"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      )}

      {/* G. Footer */}
      <Reveal delay={60}>
        <AphComFooter company={card.companyName} />
      </Reveal>

      {/* Mobile sticky CTA */}
      <StickySaveContact slug={card.slug} firstName={firstName} />
    </PublicCardExperience>
  );
}
