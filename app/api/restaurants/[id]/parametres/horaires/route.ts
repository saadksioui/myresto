import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaHoraire } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer tous les horaires d'un restaurant
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const restaurantId = params.id;

  // Pour les horaires, l'authentification n'est pas nécessaire car ils sont publics
  const horaires = await prisma.horaire.findMany({
    where: { restaurant_id: restaurantId },
    orderBy: [
      { lieu_id: 'asc' },
      { jour_semaine: 'asc' },
    ],
    include: {
      lieu: true,
    },
  });

  return Response.json({ horaires });
})

// Créer ou mettre à jour des horaires
export const POST = apiHandler(async (
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

  // Les horaires sont envoyés sous forme de tableau
  if (!Array.isArray(data.horaires)) {
    throw new ApiError("Format d'horaires invalide");
  }

  // Valider chaque horaire
  for (const horaire of data.horaires) {
    const validationResult = schemaHoraire.safeParse(horaire);

    if (!validationResult.success) {
      throw new ApiError(validationResult.error.issues[0].message);
    }

    // Vérifier que le lieu appartient au restaurant si un lieu_id est fourni
    if (horaire.lieu_id) {
      const lieu = await prisma.lieu.findFirst({
        where: {
          id: horaire.lieu_id,
          restaurant_id: restaurantId,
        },
      });

      if (!lieu) {
        throw new ApiError(`Lieu non trouvé: ${horaire.lieu_id}`);
      }
    }
  }

  // Mettre à jour les horaires avec une transaction
  const horairesUpdated = await prisma.$transaction(async (tx) => {
    // Supprimer tous les horaires existants
    if (data.remplacer) {
      await tx.horaire.deleteMany({
        where: { restaurant_id: restaurantId },
      });
    }

    // Créer les nouveaux horaires
    const créés = [];

    for (const horaire of data.horaires) {
      const nouvelHoraire = await tx.horaire.create({
        data: {
          restaurant_id: restaurantId,
          jour_semaine: horaire.jour_semaine,
          activé: horaire.activé,
          heure_ouverture: horaire.heure_ouverture,
          heure_fermeture: horaire.heure_fermeture,
          lieu_id: horaire.lieu_id,
        },
      });

      créés.push(nouvelHoraire);
    }

    return créés;
  });

  // Récupérer tous les horaires mis à jour
  const horaires = await prisma.horaire.findMany({
    where: { restaurant_id: restaurantId },
    orderBy: [
      { lieu_id: 'asc' },
      { jour_semaine: 'asc' },
    ],
    include: {
      lieu: true,
    },
  });

  return Response.json(
    { success: true, horaires },
    { status: 201 }
  );
})