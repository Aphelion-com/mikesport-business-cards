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
      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-500/30 transition active:scale-[0.98] hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl"
    >
      {saved ? (
        <>
          <Check className="h-5 w-5" />
          Contact Downloaded
        </>
      ) : (
        <>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
            <Download className="h-4 w-4" />
          </span>
          Save Contact
        </>
      )}
    </button>
  );
}
