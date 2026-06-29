import path from "path";

/** Directory where uploaded images are stored (persistent volume in Docker). */
export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3 MB

// Allowed mime -> extension
export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/** Only allow safe filenames (no path traversal). */
export function isSafeFilename(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

export function extFromFilename(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}
