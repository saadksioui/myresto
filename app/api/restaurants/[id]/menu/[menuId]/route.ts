import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaMenu } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer un menu spécifique
export const GET = apiHandler( async (
  req: NextRequest,
  { params }: { params: { id: string, menuId: string } }
) => {
  const { id: restaurantId, menuId } = params;

  const menu = await prisma.menu.findFirst({
    where: {
      id: menuId,
      restaurant_id: restaurantId
    },
    include: {
      options: true,
      catégorie: true
    }
  });

  if (!menu) {
    throw new ApiError("Menu non trouvé", 404);
  }

  return Response.json({ menu });
})

// Mettre à jour un menu
export const PUT = apiHandler( async (
  req: NextRequest,
  { params }: { params: { id: string, menuId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, menuId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.MENU.MODIFIER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Vérifier si le menu existe et appartient au restaurant
  const menuExistant = await prisma.menu.findFirst({
    where: {
      id: menuId,
      restaurant_id: restaurantId
    },
    include: {
      options: true
    }
  });

  if (!menuExistant) {
    throw new ApiError("Menu non trouvé", 404);
  }

  const data = await req.json();

  // Valider les données
  const validationResult = schemaMenu.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const {
    nom,
    description,
    prix,
    catégorie_id,
    image_url,
    actif,
    options
  } = validationResult.data;

  // Mettre à jour le menu avec transaction pour gérer les options
  const menu = await prisma.$transaction(async (tx) => {
    // Mettre à jour le menu
    const updatedMenu = await tx.menu.update({
      where: { id: menuId },
      data: {
        nom,
        description,
        prix,
        catégorie_id,
        image_url,
        actif,
      },
    });

    // Si des options sont fournies, les mettre à jour
    if (options) {
      // Supprimer les options existantes
      await tx.option.deleteMany({
        where: { menu_id: menuId },
      });

      // Créer les nouvelles options
      await Promise.all(
        options.map((opt: any) =>
          tx.option.create({
            data: {
              menu_id: menuId,
              nom: opt.nom,
              prix_supplément: opt.prix_supplément,
            },
          })
        )
      );
    }

    return updatedMenu;
  });

  // Récupérer le menu mis à jour avec ses options
  const menuMisÀJour = await prisma.menu.findUnique({
    where: { id: menuId },
    include: {
      options: true,
      catégorie: true,
    },
  });

  return Response.json({
    success: true,
    menu: menuMisÀJour
  });
})

// Supprimer un menu
export const DELETE = apiHandler( async (
  req: NextRequest,
  { params }: { params: { id: string, menuId: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const { id: restaurantId, menuId } = params;

  // Vérifier l'accès de l'utilisateur au restaurant
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) {
    throw new ApiError("Accès refusé", 403);
  }

  if (!access.permissions.includes(PERMISSIONS.MENU.SUPPRIMER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  // Vérifier si le menu existe et appartient au restaurant
  const menuExistant = await prisma.menu.findFirst({
    where: {
      id: menuId,
      restaurant_id: restaurantId
    }
  });

  if (!menuExistant) {
    throw new ApiError("Menu non trouvé", 404);
  }

  // Supprimer le menu et ses options
  await prisma.menu.delete({
    where: { id: menuId },
  });

  return Response.json({ success: true });
})