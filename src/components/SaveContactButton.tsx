"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";

export default function SaveContactButton({ slug }: { slug: string }) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
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
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition active:scale-[0.98] hover:from-brand-700 hover:to-brand-800"
    >
      {saved ? (
        <>
          <Check className="h-5 w-5" />
          Contact Downloaded
        </>
      ) : (
        <>
          <Download className="h-5 w-5" />
          Save Contact
        </>
      )}
    </button>
  );
}
