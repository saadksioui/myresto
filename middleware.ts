import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Pages publiques (pas besoin d'authentification)
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

  // Vérifier l'authentification pour les routes protégées
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    // Rediriger vers la page de connexion
    const url = new URL("/auth/signin", req.url);
    url.searchParams.set("callbackUrl", encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Pour les routes spécifiques à un restaurant, vérifier l'accès au restaurant
  if (
    pathname.match(/\/restaurant[s]?\/[^\/]+/) ||
    pathname.match(/\/api\/restaurants?\/[^\/]+/)
  ) {
    // Extraire l'ID du restaurant de l'URL
    const restaurantIdMatch = pathname.match(/\/restaurants?\/([^\/]+)/);

    if (restaurantIdMatch) {
      const restaurantId = restaurantIdMatch[1];
      const restaurants = Array.isArray(token.restaurants) ? token.restaurants : [];

      // Vérifier si l'utilisateur a accès à ce restaurant
      const hasAccess = restaurants.some((r: any) => r.id === restaurantId);

      if (!hasAccess) {
        // Rediriger vers la page d'accueil ou d'erreur
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

// Configuration du middleware pour s'exécuter sur toutes les routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};