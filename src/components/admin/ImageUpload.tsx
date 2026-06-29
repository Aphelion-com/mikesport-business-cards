"use client";

import { useRef, useState } from "react";
import { Upload, Link2, Trash2, Loader2, ImageIcon } from "lucide-react";

/**
 * Image field with two ways to set a value:
 *  1. Upload a file (jpg/png/webp, ≤3MB) -> POST /api/uploads -> relative URL
 *  2. Paste an external image URL
 * Shows a live preview and a remove button.
 */
export default function ImageUpload({
  value,
  onChange,
  rounded = false,
  label = "Image",
  onError,
}: {
  value: string;
  onChange: (url: string) => void;
  rounded?: boolean;
  label?: string;
  onError?: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        onError?.(data.error || "Upload failed.");
        return;
      }
      onChange(data.url);
    } catch {
      onError?.("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      {/* Preview */}
      <div
        className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-slate-50 ${
          rounded ? "rounded-full" : "rounded-2xl"
        }`}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-7 w-7 text-slate-300" />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-ink-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 text-brand-500" />
            )}
            {uploading ? "Uploading…" : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
          <Link2 className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="…or paste an image URL"
            className="w-full bg-transparent py-2 text-sm outline-none"
          />
        </div>
        <p className="text-xs text-slate-400">
          JPG, PNG, WEBP (≤3 MB) or SVG (≤1 MB)
        </p>
      </div>
    </div>
  );
}
