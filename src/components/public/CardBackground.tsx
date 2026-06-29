"use client";

import { useEffect, useRef } from "react";

/**
 * Animated warm background: floating orange/cream blobs + faint diagonal
 * texture. On desktop (fine pointer) the whole layer drifts slightly with the
 * mouse for a subtle parallax. Disabled for reduced-motion / touch devices.
 */
export default function CardBackground() {
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
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 24;
        el.style.setProperty("--px", `${x.toFixed(1)}px`);
        el.style.setProperty("--py", `${y.toFixed(1)}px`);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        transform: "translate(var(--px, 0px), var(--py, 0px))",
        transition: "transform 0.4s ease-out",
      }}
    >
      <div
        className="absolute -left-28 top-[-90px] h-72 w-72 animate-blob-1 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
      />
      <div
        className="absolute -right-28 top-1/3 h-80 w-80 animate-blob-2 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #c99a4a 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-64 w-64 animate-blob-1 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, #f1582b 0%, transparent 70%)" }}
      />
      {/* faint diagonal texture */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #161616 0 1px, transparent 1px 26px)",
        }}
      />
    </div>
  );
}
