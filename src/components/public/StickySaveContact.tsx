"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { downloadVcard } from "@/lib/saveContact";

/**
 * Mobile-only sticky Save Contact button that slides in after the user scrolls
 * a little. Hidden on desktop (the in-card CTA is enough there).
 */
export default function StickySaveContact({
  slug,
  firstName,
}: {
  slug: string;
  firstName: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 340);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 transition-all duration-300 sm:hidden ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <button
        onClick={() => downloadVcard(slug)}
        className="btn-shine flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 font-semibold text-white shadow-2xl shadow-brand-500/40 active:scale-[0.98]"
      >
        <Download className="h-4 w-4" />
        Save {firstName} to Contacts
      </button>
    </div>
  );
}
