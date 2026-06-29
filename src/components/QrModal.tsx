"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, Download, Loader2 } from "lucide-react";

export default function QrModal({
  url,
  name,
  onClose,
}: {
  url: string;
  name: string;
  onClose: () => void;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: "H",
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((d) => {
        if (active) setDataUrl(d);
      })
      .catch((e) => console.error("QR generation failed:", e));
    return () => {
      active = false;
    };
  }, [url]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function download() {
    if (!dataUrl) return;
    const safe = name.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${safe || "qr"}_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">QR Code</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-1 truncate text-sm text-slate-500">{name}</p>

        <div className="mt-5 flex items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt="QR code" className="h-56 w-56" />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
            </div>
          )}
        </div>

        <p className="mt-3 break-all text-center text-xs text-slate-400">{url}</p>

        <button
          onClick={download}
          disabled={!dataUrl}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          Download PNG
        </button>
      </div>
    </div>
  );
}
