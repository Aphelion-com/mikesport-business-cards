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
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-950 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-ink-950/20 ring-1 ring-inset ring-white/10 transition active:scale-[0.98] hover:bg-ink-900"
    >
      {saved ? (
        <>
          <Check className="h-5 w-5 text-brand-500" />
          Contact Downloaded
        </>
      ) : (
        <>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-ink-950">
            <Download className="h-4 w-4" />
          </span>
          Save Contact
        </>
      )}
    </button>
  );
}
