import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaLivreur } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer tous les livreurs d'un restaurant
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

  if (!access.permissions.includes(PERMISSIONS.LIVREUR.LIRE) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Récupérer les livreurs
  const livreurs = await prisma.livreur.findMany({
    where: { restaurant_id: restaurantId },
    orderBy: { nom: 'asc' },
  });

  return Response.json({ livreurs });
});

//Créer un nouveau livreur
export const POST = apiHandler( async (
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

  if (!access.permissions.includes(PERMISSIONS.LIVREUR.CRÉER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  const data = await req.json();

  // Valider les données
  const validationResult = schemaLivreur.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const { nom, téléphone, email, actif } = validationResult.data;

  // Créer le livreur
  const livreur = await prisma.livreur.create({
    data: {
      restaurant_id: restaurantId,
      nom,
      téléphone,
      email,
      actif,
    },
  });

  return Response.json(
    { success: true, livreur },
    { status: 201 }
  );
})