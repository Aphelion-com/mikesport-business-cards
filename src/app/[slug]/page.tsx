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
import PublicCardExperience from "@/components/public/PublicCardExperience";
import Reveal from "@/components/public/Reveal";
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

function Emblem({ src, className }: { src?: string | null; className?: string }) {
  if (src) return <Img src={src} alt="Mike Sport" className={className} />;
  return <Wordmark className="!text-base" />;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-px flex-1 bg-warmborder" />
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
        {children}
      </span>
      <span className="h-px flex-1 bg-warmborder" />
    </div>
  );
}

function ContactCard({
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
    <div className="group flex h-full items-center gap-4 rounded-2xl border border-warmborder bg-white px-4 py-3.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-warmborder bg-sand text-brand-600 transition group-hover:scale-105 group-hover:bg-brand-50">
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
      className={`flex items-center justify-center gap-1.5 rounded-full border px-3 py-3 text-sm font-semibold transition duration-300 active:scale-95 ${
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
    <main>
      <PublicCardExperience>{children}</PublicCardExperience>
    </main>
  );
}

function BrandHeader({
  emblemSrc,
  company,
}: {
  emblemSrc?: string | null;
  company?: string | null;
}) {
  return (
    <div className="mb-8 flex animate-fade-in flex-col items-center gap-3">
      <div className="group inline-flex items-center gap-2 rounded-full border border-warmborder bg-white/70 px-4 py-2 shadow-sm backdrop-blur transition duration-500 hover:-translate-y-0.5 hover:shadow-md">
        {emblemSrc ? (
          <Img
            src={emblemSrc}
            alt={company || "Mike Sport"}
            className="h-7 w-auto max-w-[150px] object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Wordmark className="!text-sm" />
        )}
      </div>
      <span className="accent-line block h-[3px] w-12 rounded-full" />
    </div>
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
        <div className="flex min-h-[78vh] flex-col items-center justify-center">
          <div className="w-full animate-scale-in rounded-4xl border border-warmborder bg-white/90 p-8 text-center shadow-card backdrop-blur">
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
          <AphComFooter company={card.companyName} />
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

  const location = card.address || card.officeLocation;

  const contactItems = [
    {
      key: "mobile",
      icon: <Smartphone className="h-5 w-5" />,
      label: "Mobile",
      value: card.mobilePhone,
      href: `tel:${card.mobilePhone}`,
    },
    card.companyPhone && {
      key: "company",
      icon: <Phone className="h-5 w-5" />,
      label: "Company",
      value: card.extension
        ? `${card.companyPhone} · ext ${card.extension}`
        : card.companyPhone,
      href: `tel:${card.companyPhone}${card.extension ? `,${card.extension}` : ""}`,
    },
    {
      key: "email",
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: card.email,
      href: `mailto:${card.email}`,
    },
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

  const proDetails = [
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
    <Shell>
      <TrackPageView slug={card.slug} />

      {/* B. Brand header — premium pill + animated accent line */}
      {emblemPosition !== "footer" && (
        <BrandHeader emblemSrc={emblemSrc} company={card.companyName} />
      )}

      {/* C. Main profile card */}
      <div className="overflow-hidden rounded-[28px] border border-warmborder bg-white/85 shadow-card backdrop-blur-md">
        <div className="h-1.5 bg-gradient-to-r from-brand-500 via-brand-400 to-gold" />

        <div className="px-6 pb-8 pt-8 sm:px-8">
          {/* Hero */}
          <div className="flex justify-center">
            <div className="relative animate-scale-in">
              {/* glow */}
              <span className="absolute inset-0 -z-10 animate-pulse-glow rounded-full bg-brand-500/30 blur-2xl" />
              <div className="rounded-full bg-gradient-to-br from-brand-500 to-gold p-[3px] shadow-[0_12px_30px_-10px_rgba(241,88,43,0.6)]">
                {card.profileImageUrl ? (
                  <Img
                    src={card.profileImageUrl}
                    alt={card.profileImageAlt || card.fullName}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-graphite text-4xl font-extrabold text-brand-500">
                    {initials(card.fullName)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 text-center">
            <h1
              className="animate-fade-in-up text-[26px] font-bold leading-tight tracking-tight text-graphite"
              style={{ animationDelay: "80ms" }}
            >
              {card.fullName}
            </h1>
            <div
              className="mt-2.5 flex animate-fade-in-up flex-wrap items-center justify-center gap-2"
              style={{ animationDelay: "140ms" }}
            >
              <span className="rounded-full bg-brand-500 px-3.5 py-1 text-sm font-semibold text-white shadow-sm">
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
                className="mt-2 animate-fade-in-up text-sm font-semibold text-graphite"
                style={{ animationDelay: "180ms" }}
              >
                {card.companyName}
              </p>
            )}
            {card.description && (
              <p
                className="mx-auto mt-4 max-w-sm animate-fade-in-up text-center text-[14px] leading-relaxed text-slate-600"
                style={{ animationDelay: "220ms" }}
              >
                {card.description}
              </p>
            )}
          </div>

          {/* D. Action area */}
          <div className="mt-7 animate-fade-in-up" style={{ animationDelay: "280ms" }}>
            <h2 className="mb-3 text-center text-sm font-bold text-graphite">
              Connect with {firstName}
            </h2>
            <SaveContactButton slug={card.slug} />
            <div className="mt-2.5 grid grid-cols-3 gap-2.5">
              <PillButton href={`tel:${card.mobilePhone}`} icon={<Phone className="h-4 w-4 text-brand-600" />} label="Call" />
              <PillButton href={`mailto:${card.email}`} icon={<Mail className="h-4 w-4 text-brand-600" />} label="Email" />
              <PillButton href={card.website || "#"} icon={<Globe className="h-4 w-4 text-brand-600" />} label="Web" target={!!card.website} disabled={!card.website} />
            </div>
          </div>
        </div>
      </div>

      {/* E. Contact information */}
      <div className="mt-8">
        <Reveal>
          <SectionHeading>Contact Information</SectionHeading>
        </Reveal>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {contactItems.map((c, i) => (
            <Reveal key={c.key} delay={i * 70}>
              <ContactCard icon={c.icon} label={c.label} value={c.value} href={c.href} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* F. Professional details */}
      {proDetails.length > 0 && (
        <div className="mt-8">
          <Reveal>
            <SectionHeading>Professional Details</SectionHeading>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[22px] border border-warmborder bg-gradient-to-br from-white to-sand/60 p-5 shadow-sm">
              <dl className="grid gap-4 sm:grid-cols-2">
                {proDetails.map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-warmborder bg-white text-brand-600">
                      {r.icon}
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        {r.label}
                      </dt>
                      <dd className="truncate text-sm font-semibold text-graphite">
                        {r.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      )}

      {/* G. Social links */}
      {socials.length > 0 && (
        <div className="mt-8">
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

      {/* Footer emblem (if footer position) */}
      {emblemPosition === "footer" && (
        <div className="mt-8 flex justify-center">
          <Emblem src={emblemSrc} className="h-8 w-auto max-w-[150px] object-contain" />
        </div>
      )}

      {/* H. Powered footer */}
      <AphComFooter company={card.companyName} />
    </Shell>
  );
}
