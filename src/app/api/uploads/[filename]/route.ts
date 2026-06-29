import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import {
  uploadDir,
  isSafeFilename,
  extFromFilename,
  CONTENT_TYPES,
} from "@/lib/uploads";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/uploads/[filename] — serve a stored image (public).
export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const { filename } = params;

  if (!isSafeFilename(filename)) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const ext = extFromFilename(filename);
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Unsupported file" }, { status: 400 });
  }

  try {
    const data = await readFile(path.join(uploadDir(), filename));
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
