import path from "path";

/** Directory where uploaded images are stored (persistent volume in Docker). */
export function uploadDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3 MB for raster images
export const MAX_SVG_BYTES = 1 * 1024 * 1024; // 1 MB for SVG

// Allowed mime -> extension
export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

export const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  ico: "image/x-icon",
};

/** Per-type maximum size in bytes. */
export function maxBytesForExt(ext: string): number {
  return ext === "svg" ? MAX_SVG_BYTES : MAX_IMAGE_BYTES;
}

/** Only allow safe filenames (no path traversal). */
export function isSafeFilename(name: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

export function extFromFilename(name: string): string {
  return name.split(".").pop()?.toLowerCase() ?? "";
}
