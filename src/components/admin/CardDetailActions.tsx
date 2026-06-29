"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { track } from "@/lib/track";
import { copyToClipboard } from "@/lib/clipboard";
import { previewUrl } from "@/lib/publicUrl";
import Toast, { type ToastState } from "@/components/admin/Toast";

export default function CardDetailActions({
  slug,
  fullName,
  publicUrl,
}: {
  slug: string;
  fullName: string;
  publicUrl: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(publicUrl, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0c0d0f", light: "#ffffff" },
    })
      .then((d) => active && setDataUrl(d))
      .catch((e) => console.error("QR generation failed:", e));
    return () => {
      active = false;
    };
  }, [publicUrl]);

  function downloadQr() {
    if (!dataUrl) return;
    track(slug, "QR_DOWNLOAD");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${slug}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function copyUrl() {
    const ok = await copyToClipboard(publicUrl);
    if (ok) {
      setCopied(true);
      setToast({ message: "Link copied.", variant: "success" });
      track(slug, "COPY_URL"); // tracking must not block copy
      setTimeout(() => setCopied(false), 1800);
    } else {
      setToast({
        message: "Could not copy. Please copy it manually.",
        variant: "error",
      });
    }
  }

  function preview() {
    track(slug, "PREVIEW_OPEN");
    // Current-origin URL so it works on IP now and the domain later.
    window.open(previewUrl(slug), "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
      <h2 className="font-semibold text-ink-950">QR code & links</h2>

      <div className="mt-4 flex justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt={`QR code for ${fullName}`} className="h-48 w-48" />
        ) : (
          <div className="flex h-48 w-48 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
          </div>
        )}
      </div>

      <p className="mt-3 break-all text-center text-xs text-slate-400">
        {publicUrl}
      </p>

      <div className="mt-4 space-y-2">
        <button
          onClick={downloadQr}
          disabled={!dataUrl}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:opacity-50"
        >
          <Download className="h-4 w-4 text-brand-500" />
          Download QR (PNG)
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:bg-brand-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copy URL
              </>
            )}
          </button>
          <button
            onClick={preview}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:border-brand-300 hover:bg-brand-50"
          >
            <ExternalLink className="h-4 w-4" /> Preview
          </button>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
