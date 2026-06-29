import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { isAuthenticated } from "@/lib/session";
import {
  uploadDir,
  MAX_UPLOAD_BYTES,
  ALLOWED_TYPES,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/uploads  (admin only) — multipart form with field "file".
export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const blob = file as File;
    const ext = ALLOWED_TYPES[blob.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, or WEBP." },
        { status: 415 }
      );
    }

    if (blob.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 3 MB." },
        { status: 413 }
      );
    }

    const dir = uploadDir();
    await mkdir(dir, { recursive: true });

    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buffer = Buffer.from(await blob.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);

    // Relative URL served by /api/uploads/[filename].
    const url = `/api/uploads/${filename}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
