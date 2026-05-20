// proxy.ts  (เดิมคือ middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PROTECTED = ["/checkout", "/order-confirmation", "/orders"];
const AUTH_ONLY = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  // เปลี่ยนจาก middleware → proxy
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value ?? null;
  const payload = token ? await verifyToken(token) : null;
  const isLoggedIn = !!payload;

  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/order-confirmation/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
