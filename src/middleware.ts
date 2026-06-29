import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Defensive: never interfere with API routes, Next.js assets, or public
  // files. (The matcher below already scopes this to /admin, but this keeps
  // the auth API — including /api/auth/login — reachable under any config.)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Only the admin area is protected. The login page itself is public.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  // Already logged in -> skip the login page, go to dashboard.
  if (isLoginPage && authed) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Protect every /admin route except the login page.
  if (pathname.startsWith("/admin") && !isLoginPage && !authed) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
