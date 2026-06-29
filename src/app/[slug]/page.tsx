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
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import SaveContactButton from "@/components/SaveContactButton";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

async function getCard(slug: string) {
  return prisma.card.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const card = await getCard(params.slug);
  if (!card || !card.isActive) {
    return { title: "Card not found — Mike Sport" };
  }
  return {
    title: `${card.fullName} — Mike Sport`,
    description: `${card.position} at Mike Sport. Save contact details.`,
    openGraph: {
      title: `${card.fullName} — Mike Sport`,
      description: `${card.position} at Mike Sport`,
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

// TikTok has no lucide icon; small inline SVG.
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.5c.26 0 .51.04.75.11V9.8a5.6 5.6 0 1 0 4.85 5.55V9.01a7.36 7.36 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.15-1.48Z" />
    </svg>
  );
}

function ContactRow({
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
  const content = (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-brand-700">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="truncate text-[15px] font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }
  return content;
}

export default async function PublicCardPage({ params }: Props) {
  const card = await getCard(params.slug);
  if (!card || !card.isActive) {
    notFound();
  }

  const socials = [
    { url: card.linkedinUrl, icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
    { url: card.instagramUrl, icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { url: card.facebookUrl, icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { url: card.tiktokUrl, icon: <TikTokIcon className="h-5 w-5" />, label: "TikTok" },
  ].filter((s) => s.url);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-md">
        {/* Blue gradient header */}
        <div className="relative h-44 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900">
          <div className="absolute inset-x-0 -bottom-px flex justify-center">
            <p className="pb-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
              Mike Sport
            </p>
          </div>
        </div>

        {/* White rounded card */}
        <div className="relative -mt-16 px-4 pb-10">
          <div className="rounded-4xl bg-white p-6 shadow-card">
            {/* Avatar */}
            <div className="-mt-20 flex justify-center">
              {card.profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.profileImageUrl}
                  alt={card.fullName}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-bold text-white shadow-lg">
                  {initials(card.fullName)}
                </div>
              )}
            </div>

            {/* Name + position */}
            <div className="mt-4 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {card.fullName}
              </h1>
              <p className="mt-1 font-medium text-brand-700">{card.position}</p>
            </div>

            {/* Contact rows */}
            <div className="mt-6 space-y-2.5">
              <ContactRow
                icon={<Smartphone className="h-5 w-5" />}
                label="Mobile"
                value={card.mobilePhone}
                href={`tel:${card.mobilePhone}`}
              />
              {card.companyPhone && (
                <ContactRow
                  icon={<Phone className="h-5 w-5" />}
                  label={card.extension ? "Company" : "Company"}
                  value={
                    card.extension
                      ? `${card.companyPhone} · ext ${card.extension}`
                      : card.companyPhone
                  }
                  href={`tel:${card.companyPhone}${
                    card.extension ? `,${card.extension}` : ""
                  }`}
                />
              )}
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={card.email}
                href={`mailto:${card.email}`}
              />
              {card.website && (
                <ContactRow
                  icon={<Globe className="h-5 w-5" />}
                  label="Website"
                  value={card.website.replace(/^https?:\/\//, "")}
                  href={card.website}
                />
              )}
              {card.address && (
                <ContactRow
                  icon={<MapPin className="h-5 w-5" />}
                  label="Address"
                  value={card.address}
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    card.address
                  )}`}
                />
              )}
            </div>

            {/* Social links */}
            {socials.length > 0 && (
              <div className="mt-6 flex justify-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-brand-600 hover:text-white"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}

            {/* Save contact */}
            <div className="mt-7">
              <SaveContactButton slug={card.slug} />
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Mike Sport. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
