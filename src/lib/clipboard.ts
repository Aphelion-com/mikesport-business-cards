"use client";

/**
 * Copy text to the clipboard with a robust fallback.
 * Tries the async Clipboard API first (requires a secure context / user
 * gesture), then falls back to a hidden <textarea> + execCommand("copy")
 * so it also works on plain-HTTP IP testing and older mobile browsers.
 * Returns true on success.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Preferred: async clipboard (available in secure contexts).
  try {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy method */
  }

  // Fallback: temporary textarea + execCommand.
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
