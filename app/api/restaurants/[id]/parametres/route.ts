import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaPaiement, schemaProfil } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer tous les paramètres d'un restaurant
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

  if (!access.permissions.includes(PERMISSIONS.PARAMÈTRES.LIRE) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Récupérer les paramètres
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      profil: true,
      paiement: true,
      lieux: {
        include: {
          horaires: true,
        },
      },
      abonnement: true,
    },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  return Response.json({
    paramètres: {
      général: {
        id: restaurant.id,
        nom: restaurant.nom,
        slug: restaurant.slug,
        type: restaurant.type,
        logo_url: restaurant.logo_url,
        bannière_url: restaurant.bannière_url,
        min_commande: restaurant.min_commande,
        whatsapp_commande: restaurant.whatsapp_commande,
        notifications_sonores: restaurant.notifications_sonores,
      },
      profil: restaurant.profil || null,
      paiement: restaurant.paiement || null,
      lieux: restaurant.lieux || [],
      abonnement: restaurant.abonnement || null,
    }
  });
})

// Mettre à jour les paramètres de paiment
export const PUT = apiHandler(async (
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

  if (!access.permissions.includes(PERMISSIONS.PARAMÈTRES.MODIFIER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  const data = await req.json();
  const type = data.type || "paiement"; // "paiement", "profil", "général"

  if (type === "paiement") {
    // Valider les données
    const validationResult = schemaPaiement.safeParse(data);

    if (!validationResult.success) {
      throw new ApiError(validationResult.error.issues[0].message);
    }

    const {
      livraison,
      frais_livraison,
      min_commande,
      espèce,
      cb,
      paypal,
      email_paypal,
      clé_api_cb,
    } = validationResult.data;

    // Mettre à jour ou créer les paramètres de paiement
    const paiement = await prisma.paiement.upsert({
      where: { restaurant_id: restaurantId },
      update: {
        livraison,
        frais_livraison,
        min_commande,
        espèce,
        cb,
        paypal,
        email_paypal,
        clé_api_cb,
      },
      create: {
        restaurant_id: restaurantId,
        livraison,
        frais_livraison,
        min_commande,
        espèce,
        cb,
        paypal,
        email_paypal,
        clé_api_cb,
      },
    });

    return Response.json({ success: true, paiement });
  } else if (type === "profil") {
    // Valider les données
    const validationResult = schemaProfil.safeParse(data);

    if (!validationResult.success) {
      throw new ApiError(validationResult.error.issues[0].message);
    }

    const {
      nom_gérant,
      téléphone,
      email,
      langue,
      facebook,
      instagram,
      site_web,
    } = validationResult.data;

    // Mettre à jour ou créer le profil
    const profil = await prisma.profil.upsert({
      where: { restaurant_id: restaurantId },
      update: {
        nom_gérant,
        téléphone,
        email,
        langue,
        facebook,
        instagram,
        site_web,
      },
      create: {
        restaurant_id: restaurantId,
        nom_gérant,
        téléphone,
        email,
        langue,
        facebook,
        instagram,
        site_web,
      },
    });

    return Response.json({ success: true, profil });
  } else if (type === "général") {
    // Mettre à jour les paramètres généraux du restaurant
    const {
      nom,
      type,
      min_commande,
      whatsapp_commande,
      notifications_sonores
    } = data;

    const restaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        nom,
        type,
        min_commande,
        whatsapp_commande,
        notifications_sonores,
      },
    });

    return Response.json({ success: true, restaurant });
  }

  throw new ApiError("Type de paramètres invalide");
})