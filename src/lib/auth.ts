/**
 * Lightweight, dependency-free session auth using an HMAC-signed cookie.
 * Works in both the Node.js runtime (API routes) and the Edge runtime
 * (middleware) via the Web Crypto API (globalThis.crypto.subtle).
 */

export const SESSION_COOKIE = "ms_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 8) {
    throw new Error("AUTH_SECRET is not set or too short (min 8 chars).");
  }
  return secret;
}

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(input: string): Uint8Array {
  const pad = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function hmac(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return base64url(new Uint8Array(sig));
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/** Create a signed session token for the given username. */
export async function createSessionToken(username: string): Promise<string> {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payloadObj = { u: username, exp: expires };
  const payload = base64url(new TextEncoder().encode(JSON.stringify(payloadObj)));
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

/** Verify a signed session token. Returns true if valid and not expired. */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;

  const expectedSig = await hmac(payload);
  if (!safeEqual(sig, expectedSig)) return false;

  try {
    const decoded = JSON.parse(
      new TextDecoder().decode(fromBase64url(payload))
    ) as { u: string; exp: number };
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Validate raw credentials against environment variables. */
export function checkCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  return (
    safeEqual(username, expectedUser) && safeEqual(password, expectedPass)
  );
}

export const SESSION_MAX_AGE = SESSION_TTL_SECONDS;
