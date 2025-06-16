import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiHandler, ApiError } from "@/lib/utils";

// Récupérer les informations d'un restaurant par son slug (public)
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  // Récupérer le restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      profil: true,
      lieux: {
        where: { actif: true },
        include: {
          horaires: {
            where: { activé: true },
            orderBy: { jour_semaine: 'asc' },
          },
        },
      },
      catégories: {
        where: { actif: true },
        orderBy: { ordre: 'asc' },
        include: {
          menus: {
            where: { actif: true },
            include: {
              options: true,
            },
          },
        },
      },
      paiement: {
        select: {
          livraison: true,
          frais_livraison: true,
          min_commande: true,
          espèce: true,
          cb: true,
          paypal: true,
        },
      },
    },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  return Response.json({
    restaurant: {
      id: restaurant.id,
      nom: restaurant.nom,
      type: restaurant.type,
      logo_url: restaurant.logo_url,
      bannière_url: restaurant.bannière_url,
      profil: restaurant.profil,
      lieux: restaurant.lieux,
      catégories: restaurant.catégories,
      paiement: restaurant.paiement,
    },
  });
});