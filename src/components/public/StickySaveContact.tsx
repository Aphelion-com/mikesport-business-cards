"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { downloadVcard } from "@/lib/saveContact";

/**
 * Sticky bottom Save Contact button that slides up once the in-hero Save
 * Contact button (#hero-save) scrolls out of view, and hides again when it
 * returns. Falls back to a scroll threshold if the target isn't found.
 * Full-width on mobile, a centered pill on larger screens. Uses the same
 * downloadVcard() action (tracks SAVE_CONTACT).
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
    const hero = document.getElementById("hero-save");

    if (hero && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        ([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0),
        { threshold: 0, rootMargin: "0px 0px -40px 0px" }
      );
      io.observe(hero);
      return () => io.disconnect();
    }

    // Fallback: show after ~450px of scroll.
    const onScroll = () => setShow(window.scrollY > 450);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-paper via-paper/80 to-transparent px-4 pt-6 transition-all duration-300 ease-out ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <button
        onClick={() => downloadVcard(slug)}
        className="btn-shine mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-white/40 bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 font-semibold text-white shadow-2xl shadow-brand-500/40 backdrop-blur transition active:scale-[0.98]"
      >
        <Download className="h-4 w-4" />
        Save {firstName} to Contacts
      </button>
    </div>
  );
}
