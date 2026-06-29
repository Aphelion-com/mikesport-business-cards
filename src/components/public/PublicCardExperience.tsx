"use client";

import { useEffect, useRef } from "react";
import AnimatedBackground from "@/components/public/AnimatedBackground";

/**
 * Client visual shell for the public business card page.
 * - Renders the calm animated background.
 * - Thin scroll-progress bar (#F1582B).
 * - Very slight content parallax based on mouse position (desktop only).
 */
export default function PublicCardExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const el = contentRef.current;
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.transform = `translate3d(${(x * 8).toFixed(1)}px, ${(y * 8).toFixed(1)}px, 0)`;
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
    <div className="relative min-h-screen overflow-hidden bg-paper">
      {/* Scroll progress — desktop only (kept off mobile so it never reads as a stray line) */}
      <div className="fixed inset-x-0 top-0 z-50 hidden h-[2px] sm:block">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-brand-500 to-gold transition-[width] duration-150 ease-out"
          style={{ width: "0%" }}
        />
      </div>

      <AnimatedBackground />

      <div
        ref={contentRef}
        className="relative mx-auto max-w-md px-4 pb-24 pt-8 sm:pb-16 sm:pt-12 lg:max-w-2xl"
        style={{ transition: "transform 0.4s ease-out" }}
      >
        {children}
      </div>
    </div>
  );
}
