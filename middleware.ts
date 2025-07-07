import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (no auth required)
  if (
    pathname.startsWith("/r/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  // Protected routes: check authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log("TOKEN IN MIDDLEWARE:", token);

  if (!token) {
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Check restaurant access for /restaurants/:id and /api/restaurants/:id
  const restaurantRouteMatch = pathname.match(/\/restaurants?\/([^\/]+)/);
  if (
    pathname.match(/\/restaurant[s]?\/[^\/]+/) ||
    pathname.match(/\/api\/restaurants?\/[^\/]+/)
  ) {
    if (restaurantRouteMatch) {
      const restaurantId = restaurantRouteMatch[1];
      const restaurants = Array.isArray(token.restaurants) ? token.restaurants : [];
      // Accept both array of ids or array of objects with id
      const hasAccess = restaurants.some((r: any) =>
        typeof r === "string" ? r === restaurantId : r.id === restaurantId
      );

      if (!hasAccess) {
        if (pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        } else {
          const url = new URL("/dashboard", req.url);
          return NextResponse.redirect(url);
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};