"use client";

import { useEffect, useRef } from "react";

/**
 * Calm, premium animated background: warm cream gradient with soft blurred
 * shapes that float slowly and drift gently with the mouse on desktop.
 * No diagonal lines, no harsh orange glow. Mouse parallax is disabled for
 * touch / reduced-motion; the slow float keeps running.
 */
export default function AnimatedBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia?.("(pointer: coarse)").matches
    ) {
      return;
    }
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--sx", x.toFixed(3));
        el.style.setProperty("--sy", y.toFixed(3));
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {/* warm gradient base */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper via-paper to-cream" />
      {/* soft floating shapes */}
      <div
        ref={ref}
        className="absolute inset-0"
        style={{
          transform: "translate3d(calc(var(--sx,0) * 36px), calc(var(--sy,0) * 36px), 0)",
          transition: "transform 0.5s ease-out",
        }}
      >
        <div
          className="absolute -left-24 top-[-60px] h-[22rem] w-[22rem] animate-blob-1 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-[-60px] top-1/4 h-[26rem] w-[26rem] animate-blob-2 rounded-full opacity-50 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(243,238,231,0.95) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-40px] left-1/3 h-[20rem] w-[20rem] animate-blob-1 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(241,88,43,0.06) 0%, transparent 70%)" }}
        />
        <div
          className="absolute right-1/4 top-2/3 h-[16rem] w-[16rem] animate-blob-2 rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(201,154,74,0.08) 0%, transparent 70%)" }}
        />
        {/* tiny soft floating accent dots */}
        <span className="absolute left-[12%] top-[22%] h-2 w-2 animate-float rounded-full bg-brand-500/20" />
        <span
          className="absolute right-[16%] top-[40%] h-1.5 w-1.5 animate-float rounded-full bg-gold/30"
          style={{ animationDelay: "1.2s" }}
        />
        <span
          className="absolute left-[24%] bottom-[24%] h-1.5 w-1.5 animate-float rounded-full bg-brand-500/15"
          style={{ animationDelay: "2.4s" }}
        />
      </div>
    </div>
  );
}
