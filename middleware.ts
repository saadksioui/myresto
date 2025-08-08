import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (no auth required)
  if (
    pathname.startsWith("/r/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/MyRestoLogo.svg") ||
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/r/") ||
    pathname.startsWith("/restaurant/") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/api/contact/") ||
    pathname.startsWith("/api/check-user") ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // Protected routes: check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Check restaurant access for /api/restaurants and /api/restaurants/:id
  if (pathname === "/api/restaurants" && req.method === "PUT") {
    // Allow all authenticated users to create a restaurant
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};