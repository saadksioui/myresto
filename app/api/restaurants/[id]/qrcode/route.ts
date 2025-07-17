import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError, generateQRCode } from "@/lib/utils";
import { PERMISSIONS } from "@/lib/rbac";

// Générer un QR code pour le menu d'un restaurant
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const restaurantId = params.id;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.RESTAURANT.LIRE) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Récupérer le slug du restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { slug: true },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  // Construire l'URL du menu
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const menuUrl = `${baseUrl}/restaurant/${restaurant.slug}`;

  // Générer le QR code
  const qrCodeDataUrl = await generateQRCode(menuUrl);

  return Response.json({
    qrCode: qrCodeDataUrl,
    menuUrl,
  });
});