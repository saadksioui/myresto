import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaMiseÀJourStatutCommande } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer une commande spécifique
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string, commandeId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, commandeId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.COMMANDE.LIRE)) {
    throw new ApiError("Permission refusée", 403);
  }

  // Récupérer la commande
  const commande = await prisma.commande.findFirst({
    where: {
      id: commandeId,
      restaurant_id: restaurantId,
    },
    include: {
      client: true,
      livreur: true,
      détails: {
        include: {
          menu: true,
        },
      },
    },
  });

  if (!commande) {
    throw new ApiError("Commande non trouvée", 404);
  }

  return Response.json({ commande });
})

// Mettre à jour le statut d'une commande
export const PATCH = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string, commandeId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, commandeId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.COMMANDE.MODIFIER) &&
      access.rôle !== "propriétaire" && access.rôle !== "livreur" && access.rôle !== "staff") {
    throw new ApiError("Permission refusée", 403);
  }

  // Vérifier si la commande existe
  const commandeExistante = await prisma.commande.findFirst({
    where: {
      id: commandeId,
      restaurant_id: restaurantId,
    },
  });

  if (!commandeExistante) {
    throw new ApiError("Commande non trouvée", 404);
  }

  const data = await req.json();

  // Valider les données
  const validationResult = schemaMiseÀJourStatutCommande.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const { statut, livreur_id } = validationResult.data;

  // Si un livreur est assigné, vérifier qu'il appartient au restaurant
  if (livreur_id) {
    const livreur = await prisma.livreur.findFirst({
      where: {
        id: livreur_id,
        restaurant_id: restaurantId,
        actif: true,
      },
    });

    if (!livreur) {
      throw new ApiError("Livreur non trouvé ou inactif", 404);
    }

    // Vérifier si l'utilisateur a la permission d'assigner des commandes
    if (!access.permissions.includes(PERMISSIONS.COMMANDE.ASSIGNER) &&
        access.rôle !== "propriétaire") {
      throw new ApiError("Permission d'assigner un livreur refusée", 403);
    }
  }

  // Mettre à jour la commande
  const commande = await prisma.commande.update({
    where: { id: commandeId },
    data: {
      statut,
      livreur_id,
    },
    include: {
      client: true,
      livreur: true,
      détails: {
        include: {
          menu: true,
        },
      },
    },
  });

  return Response.json({ success: true, commande });
})