"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastState = {
  message: string;
  variant: "success" | "error";
} | null;

export default function Toast({
  toast,
  onClose,
}: {
  toast: ToastState;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  const success = toast.variant === "success";

  return (
    <div className="fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:bottom-6">
      <div
        className={`flex animate-fade-in-up items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white shadow-2xl ${
          success ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        {success ? (
          <CheckCircle2 className="h-5 w-5 shrink-0" />
        ) : (
          <AlertCircle className="h-5 w-5 shrink-0" />
        )}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-full p-0.5 transition hover:bg-white/20"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
