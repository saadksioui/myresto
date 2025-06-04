import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaLivreur } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer un livreur spécifique
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string, livreurId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, livreurId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.LIVREUR.LIRE)) {
    throw new ApiError("Permission refusée", 403);
  }

  // Récupérer le livreur
  const livreur = await prisma.livreur.findFirst({
    where: {
      id: livreurId,
      restaurant_id: restaurantId,
    },
  });

  if (!livreur) {
    throw new ApiError("Livreur non trouvé", 404);
  }

  return Response.json({ livreur });
})

// Mettre à jour un livreur
export const PUT = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string, livreurId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, livreurId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.LIVREUR.MODIFIER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Vérifier si le livreur existe
  const livreurExistant = await prisma.livreur.findFirst({
    where: {
      id: livreurId,
      restaurant_id: restaurantId,
    },
  });

  if (!livreurExistant) {
    throw new ApiError("Livreur non trouvé", 404);
  }

  const data = await req.json();

  // Valider les données
  const validationResult = schemaLivreur.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const { nom, téléphone, email, actif } = validationResult.data;

  // Mettre à jour le livreur
  const livreur = await prisma.livreur.update({
    where: { id: livreurId },
    data: {
      nom,
      téléphone,
      email,
      actif,
    },
  });

  return Response.json({ success: true, livreur });
})

// Supprimer un livreur
export const DELETE = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string, livreurId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, livreurId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.LIVREUR.SUPPRIMER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Vérifier si le livreur existe
  const livreurExistant = await prisma.livreur.findFirst({
    where: {
      id: livreurId,
      restaurant_id: restaurantId,
    },
  });

  if (!livreurExistant) {
    throw new ApiError("Livreur non trouvé", 404);
  }

  // Vérifier si le livreur a des commandes assignées
  const commandesAssignées = await prisma.commande.count({
    where: {
      livreur_id: livreurId,
      statut: { in: ["assignée", "en_préparation"] },
    },
  });

  if (commandesAssignées > 0) {
    throw new ApiError("Impossible de supprimer un livreur avec des commandes en cours");
  }

  // Supprimer le livreur
  await prisma.livreur.delete({
    where: { id: livreurId },
  });

  return Response.json({ success: true });
})