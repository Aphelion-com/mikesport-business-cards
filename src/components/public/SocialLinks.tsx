"use client";

import { Linkedin, Instagram, Facebook } from "lucide-react";
import { track } from "@/lib/track";
import Reveal from "@/components/public/Reveal";

export type SocialNetwork = "linkedin" | "instagram" | "x" | "facebook" | "tiktok";

export type SocialItem = { network: SocialNetwork; href: string };

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.05-2.82h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.5c.26 0 .51.04.75.11V9.8a5.6 5.6 0 1 0 4.85 5.55V9.01a7.36 7.36 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.15-1.48Z" />
    </svg>
  );
}

const META: Record<SocialNetwork, { label: string; icon: React.ReactNode }> = {
  linkedin: { label: "LinkedIn", icon: <Linkedin className="h-5 w-5" /> },
  instagram: { label: "Instagram", icon: <Instagram className="h-5 w-5" /> },
  x: { label: "X", icon: <XIcon className="h-[18px] w-[18px]" /> },
  facebook: { label: "Facebook", icon: <Facebook className="h-5 w-5" /> },
  tiktok: { label: "TikTok", icon: <TikTokIcon className="h-5 w-5" /> },
};

export default function SocialLinks({
  slug,
  items,
}: {
  slug: string;
  items: SocialItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {items.map((item, i) => {
        const meta = META[item.network];
        return (
          <Reveal key={item.network} delay={i * 80}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={meta.label}
              onClick={() => track(slug, "SOCIAL_CLICK")}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-warmborder bg-white text-graphite transition duration-300 hover:-translate-y-1 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 hover:shadow-lg"
            >
              {meta.icon}
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}
