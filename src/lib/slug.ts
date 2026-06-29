/**
 * Convert a full name (or any string) into a URL-friendly slug.
 * "Rawad Halloun" -> "rawad-halloun"
 */
export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove non-alphanumeric
    .replace(/[\s_-]+/g, "-") // collapse whitespace & dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}
