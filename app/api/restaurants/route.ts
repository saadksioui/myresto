import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaConfigurationÉtape1 } from "@/lib/validation";
import { PERMISSIONS, RÔLE_PERMISSIONS } from "@/lib/rbac";

// Récupérer tous les restaurants de l'utilisateur connecté
export const GET = apiHandler(async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;

  const userRestos = await prisma.userResto.findMany({
    where: { user_id: userId },
    include: {
      restaurant: {
        include: {
          profil: true,
          abonnement: true,
        },
      },
      rôle: true,
    },
  });

  const restaurants = userRestos.map((ur) => ({
    id: ur.restaurant.id,
    nom: ur.restaurant.nom,
    slug: ur.restaurant.slug,
    type: ur.restaurant.type,
    logo_url: ur.restaurant.logo_url,
    bannière_url: ur.restaurant.bannière_url,
    étape_configuration: ur.restaurant.étape_configuration,
    abonnement: ur.restaurant.abonnement ? {
      type: ur.restaurant.abonnement.type,
      statut: ur.restaurant.abonnement.statut,
      date_fin: ur.restaurant.abonnement.date_fin,
    } : null,
    profil: ur.restaurant.profil,
    rôle: {
      nom: ur.rôle.nom,
      permissions: ur.rôle.permissions,
    },
  }));

  return Response.json({ restaurants });
})

// Créer un nouveau restaurant
export const POST = apiHandler(async (req: NextRequest) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const data = await req.json();

  // Valider les données
  const validationResult = schemaConfigurationÉtape1.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const { nom, type } = validationResult.data;
  let { slug } = validationResult.data;

  // Générer un slug unique si non fourni
  if (!slug) {
    slug = await generateUniqueSlug(nom);
  }

  // Trouver le rôle de propriétaire
  let rôlePropriétaire = await prisma.rôle.findFirst({
    where: { nom: "propriétaire" },
  });

  // Créer le rôle propriétaire s'il n'existe pas
  if (!rôlePropriétaire) {
    rôlePropriétaire = await prisma.rôle.create({
      data: {
        nom: "propriétaire",
        permissions: RÔLE_PERMISSIONS.PROPRIÉTAIRE,
      },
    });
  }

  // Créer le restaurant et associer l'utilisateur
  const restaurant = await prisma.$transaction(async (tx) => {
    // Créer le restaurant
    const newRestaurant = await tx.restaurant.create({
      data: {
        nom,
        type,
        slug,
        étape_configuration: 1,
      },
    });

    // Associer l'utilisateur au restaurant avec le rôle propriétaire
    await tx.userResto.create({
      data: {
        user_id: userId,
        restaurant_id: newRestaurant.id,
        rôle_id: rôlePropriétaire.id,
      },
    });

    // Créer un abonnement gratuit par défaut
    await tx.abonnement.create({
      data: {
        restaurant_id: newRestaurant.id,
        type: "gratuit",
        statut: "actif",
        date_début: new Date(),
        date_fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
      },
    });

    return newRestaurant;
  });

  return Response.json(
    {
      success: true,
      restaurant: {
        id: restaurant.id,
        nom: restaurant.nom,
        slug: restaurant.slug,
        type: restaurant.type,
        étape_configuration: restaurant.étape_configuration,
      }
    },
    { status: 201 }
  );
})