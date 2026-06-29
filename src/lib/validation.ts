import { z } from "zod";

// Optional free-text field: empty string / undefined -> null (so edits can clear it).
const optionalString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    const t = typeof v === "string" ? v.trim() : v;
    return t === "" || t === undefined || t === null ? null : t;
  });

// Optional strict URL (for website / social links). Empty -> null.
const optionalUrl = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => (typeof v === "string" ? v.trim() : v))
  .refine(
    (v) => {
      if (v === "" || v === undefined || v === null) return true;
      try {
        // eslint-disable-next-line no-new
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL (include https://)" }
  )
  .transform((v) =>
    v === "" || v === undefined || v === null ? null : (v as string)
  );

// Optional image reference: empty -> null, a relative upload path (/api/uploads/…)
// OR an absolute http(s) URL. Used for profile images and the dashboard logo.
const optionalImageRef = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => (typeof v === "string" ? v.trim() : v))
  .refine(
    (v) => {
      if (v === "" || v === undefined || v === null) return true;
      if (v.startsWith("/")) return true; // relative uploaded asset
      try {
        // eslint-disable-next-line no-new
        new URL(v);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Must be an uploaded image or a valid image URL" }
  )
  .transform((v) =>
    v === "" || v === undefined || v === null ? null : (v as string)
  );

export const cardSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug may only contain lowercase letters, numbers and dashes"
    ),
  position: z.string().trim().min(2, "Position is required"),
  department: optionalString,
  companyName: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === "" ? "Mike Sport" : v)),
  officeLocation: optionalString,
  description: z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => {
      const t = typeof v === "string" ? v.trim() : v;
      return t === "" || t === undefined || t === null ? null : t;
    })
    .refine((v) => v === null || v.length <= 600, {
      message: "Description must be 600 characters or fewer",
    }),
  mobilePhone: z.string().trim().min(3, "Mobile phone is required"),
  companyPhone: optionalString,
  extension: optionalString,
  email: z.string().trim().email("Must be a valid email"),
  website: optionalUrl,
  address: optionalString,
  profileImageUrl: optionalImageRef,
  profileImageAlt: optionalString,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  displayOrder: z
    .union([z.number(), z.string(), z.null(), z.undefined()])
    .transform((v) => {
      if (v === "" || v === undefined || v === null) return 0;
      const n = typeof v === "string" ? parseInt(v, 10) : v;
      return Number.isFinite(n) ? n : 0;
    }),
  isActive: z.boolean().default(true),
});

export type CardInput = z.infer<typeof cardSchema>;

// Hex color like #f97316 (3 or 6 digits).
const hexColor = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color, e.g. #f97316");

export const settingsSchema = z.object({
  logoUrl: optionalImageRef,
  dashboardTitle: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v === undefined || v === "" ? "Mike Sport Cards" : v)),
  accentColor: z
    .union([hexColor, z.literal(""), z.null(), z.undefined()])
    .transform((v) => (v === "" || v === undefined || v === null ? "#F58220" : v)),
  companyWebsite: optionalUrl,
  defaultAddress: optionalString,
  defaultCompanyPhone: optionalString,
  cardEmblemUrl: optionalImageRef,
  showEmblemOnCards: z
    .union([z.boolean(), z.undefined()])
    .transform((v) => (v === undefined ? true : v)),
  emblemPosition: z
    .union([z.enum(["top", "header", "footer"]), z.literal(""), z.undefined()])
    .transform((v) => (v === "" || v === undefined ? "top" : v)),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
