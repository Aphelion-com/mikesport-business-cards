"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/track";

/**
 * Records a single PAGE_VIEW when a public card page mounts.
 * Uses a ref + sessionStorage to avoid obvious double-counting (React strict
 * mode double-invoke, quick refreshes within the same tab session).
 */
export default function TrackPageView({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    try {
      const key = `ms_view_${slug}`;
      const last = sessionStorage.getItem(key);
      const now = Date.now();
      // Throttle to at most one view per 30 minutes per tab session.
      if (last && now - Number(last) < 30 * 60 * 1000) return;
      sessionStorage.setItem(key, String(now));
    } catch {
      /* sessionStorage unavailable — still track */
    }

    track(slug, "PAGE_VIEW");
  }, [slug]);

  return null;
}
