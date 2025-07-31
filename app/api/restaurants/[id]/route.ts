import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import {
  schemaConfigurationÉtape1,
  schemaConfigurationÉtape2,
  schemaConfigurationÉtape3
} from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: string, folder: string) {
  const res = await cloudinary.v2.uploader.upload(file, {
    folder,
    resource_type: "image",
  });
  return res.secure_url;
}

interface Etape1 {
  nom: string;
  type: string;
  slug: string;
}

interface Etape2 {
  whatsapp_commande: boolean;
  adresse: string;
  téléphone: string;
}

interface Etape3 {
  logo_url: string;
  bannière_url: string;
}

// Récupérer un restaurant spécifique
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

  // Récupérer les détails du restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      menus: true,
      commandes: {
        include: {
          client: true,
          livreur: true,
        },
      },
      profil: true,
      abonnement: true,
      paiement: true,
      livreurs: true,
      lieux: {
        include: {
          horaires: true,
        },
      },
    },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  return Response.json({ restaurant });
});

// Mettre à jour un restaurant - Configuration étape 1, 2 ou 3
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

  const data = await req.json();

  // Récupérer le restaurant actuel
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  // Déterminer l'étape de configuration et valider les données
  const étape = data.étape || restaurant.étape_configuration;
  let validationResult;

  switch (étape) {
    case 1:
      validationResult = schemaConfigurationÉtape1.safeParse(data);
      break;
    case 2:
      validationResult = schemaConfigurationÉtape2.safeParse(data);
      break;
    case 3:
      validationResult = schemaConfigurationÉtape3.safeParse(data);
      break;
    default:
      throw new ApiError("Étape de configuration invalide");
  }

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  // Mettre à jour le restaurant en fonction de l'étape
  let updatedRestaurant;

  if (étape === 1) {
    const { nom, type, slug } = validationResult.data as Etape1;

    updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        nom,
        type,
        slug: slug || restaurant.slug,
        étape_configuration: 2, // Passer à l'étape suivante
      },
    });
  } else if (étape === 2) {
    const { whatsapp_commande, adresse, téléphone } = validationResult.data as Etape2;

    // Vérifier si un lieu principal existe déjà
    const lieuPrincipal = await prisma.lieu.findFirst({
      where: {
        restaurant_id: restaurantId,
        principal: true,
      },
    });

    // Mettre à jour ou créer le lieu principal
    if (lieuPrincipal) {
      await prisma.lieu.update({
        where: { id: lieuPrincipal.id },
        data: {
          adresse,
          whatsapp: téléphone,
        },
      });
    } else {
      await prisma.lieu.create({
        data: {
          restaurant_id: restaurantId,
          nom: "Principal",
          adresse,
          whatsapp: téléphone,
          principal: true,
        },
      });
    }
    updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        whatsapp_commande,
        étape_configuration: 3, // Passer à l'étape suivante
      },
    });
  } else if (étape === 3) {
    const { logo_url, bannière_url } = validationResult.data as Etape3;

    const logo = await uploadToCloudinary(logo_url, `restaurants/${restaurantId}/logo_url`);
    const bannière = await uploadToCloudinary(bannière_url, `restaurants/${restaurantId}/bannière_url`);

    updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        logo_url: logo,
        bannière_url: bannière,
        étape_configuration: 4, // Configuration terminée
      },
    });
  }
  return Response.json({
    success: true,
    restaurant: updatedRestaurant
  });
})

// Supprimer un restaurant
export const DELETE = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const token = await getToken({ req });

  if (!token) {
    throw new ApiError("Non authentifié", 401);
  }

  const userId = token.id as string;
  const restaurantId = params.id;

  // Vérifier si l'utilisateur est propriétaire du restaurant
  const userResto = await prisma.userResto.findUnique({
    where: {
      user_id_restaurant_id: {
        user_id: userId,
        restaurant_id: restaurantId,
      },
    },
    include: {
      rôle: true,
    },
  });

  if (!userResto || userResto.rôle.nom !== "propriétaire") {
    throw new ApiError("Seul le propriétaire peut supprimer un restaurant", 403);
  }

  // Supprimer le restaurant (les relations seront supprimées automatiquement grâce aux contraintes onDelete)
  await prisma.restaurant.delete({
    where: { id: restaurantId },
  });

  return Response.json({ success: true });
});