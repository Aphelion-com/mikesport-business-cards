import { z } from "zod";

// Optional free-text field: empty string / undefined -> null (so edits can clear it).
const optionalString = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((v) => {
    const t = typeof v === "string" ? v.trim() : v;
    return t === "" || t === undefined || t === null ? null : t;
  });

// Optional URL field: empty -> null, otherwise must be a valid URL.
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
  mobilePhone: z.string().trim().min(3, "Mobile phone is required"),
  companyPhone: optionalString,
  extension: optionalString,
  email: z.string().trim().email("Must be a valid email"),
  website: optionalUrl,
  address: optionalString,
  profileImageUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  tiktokUrl: optionalUrl,
  isActive: z.boolean().default(true),
});

export type CardInput = z.infer<typeof cardSchema>;
