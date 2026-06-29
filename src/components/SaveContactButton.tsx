"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { track } from "@/lib/track";

export default function SaveContactButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    // Record the event first (fire-and-forget; never blocks the download).
    track(slug, "SAVE_CONTACT");

    // Trigger the .vcf download via the API route.
    const url = `/api/cards/${slug}/vcf`;
    const link = document.createElement("a");
    link.href = url;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <button
      onClick={handleSave}
      className="btn-shine group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
    >
      {saved ? (
        <>
          <Check className="h-5 w-5" />
          Contact Downloaded
        </>
      ) : (
        <>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/30">
            <Download className="h-4 w-4" />
          </span>
          Save Contact
        </>
      )}
    </button>
  );
}
