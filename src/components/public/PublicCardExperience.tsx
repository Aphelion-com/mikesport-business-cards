"use client";

import { useEffect, useRef } from "react";

/**
 * Client visual shell for the public business card page.
 * - Tracks mouse position into CSS vars (--mx/--my) for desktop parallax.
 * - Renders a top scroll-progress bar.
 * - Renders the layered animated background (mesh + floating blobs + diagonal
 *   pattern), each layer moving at a different parallax depth.
 * Mouse parallax is disabled for touch devices and prefers-reduced-motion;
 * the CSS blob/float animations still run.
 */
export default function PublicCardExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (!root) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        root.style.setProperty("--mx", x.toFixed(3));
        root.style.setProperty("--my", y.toFixed(3));
      });
    };

    let sraf = 0;
    const onScroll = () => {
      cancelAnimationFrame(sraf);
      sraf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const pct = max > 0 ? (el.scrollTop / max) * 100 : 0;
        if (barRef.current) barRef.current.style.width = `${pct}%`;
      });
    };

    if (!reduce && !coarse) window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-paper">
      {/* Scroll progress bar */}
      <div className="fixed inset-x-0 top-0 z-50 h-[3px]">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-brand-500 to-gold transition-[width] duration-150 ease-out"
          style={{ width: "0%" }}
        />
      </div>

      {/* Layered animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Soft mesh glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 18% 8%, rgba(241,88,43,0.10), transparent 60%), radial-gradient(45% 40% at 90% 28%, rgba(201,154,74,0.12), transparent 60%), radial-gradient(60% 50% at 50% 105%, rgba(241,88,43,0.07), transparent 60%)",
          }}
        />
        {/* Blob layer — strongest parallax */}
        <div
          className="absolute inset-0"
          style={{
            transform:
              "translate(calc(var(--mx,0) * 42px), calc(var(--my,0) * 42px))",
            transition: "transform 0.3s ease-out",
          }}
        >
          <div
            className="absolute -left-32 top-[-110px] h-80 w-80 animate-blob-1 rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
          />
          <div
            className="absolute -right-32 top-1/3 h-96 w-96 animate-blob-2 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #c99a4a 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-1/4 h-72 w-72 animate-blob-1 rounded-full opacity-[0.12] blur-3xl"
            style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
          />
        </div>
        {/* Diagonal sport lines — slower / opposite parallax */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #171717 0 1px, transparent 1px 26px)",
            transform:
              "translate(calc(var(--mx,0) * -14px), calc(var(--my,0) * -14px))",
            transition: "transform 0.3s ease-out",
          }}
        />
      </div>

      {/* Content — very slight parallax for depth */}
      <div
        className="relative mx-auto max-w-md px-4 py-9 sm:py-12 lg:max-w-xl"
        style={{
          transform:
            "translate(calc(var(--mx,0) * 7px), calc(var(--my,0) * 7px))",
          transition: "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
