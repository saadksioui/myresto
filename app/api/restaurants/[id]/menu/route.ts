import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError } from "@/lib/utils";
import { schemaMenu, schemaCatégorie } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: string, folder: string) {
  try {
    const res = await cloudinary.v2.uploader.upload(file, {
      folder,
      resource_type: "image",
    });
    return res.secure_url;
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    throw new ApiError("Erreur lors du téléchargement de l'image", 500);
  }
}

// Récupérer tous les menus d'un restaurant
export const GET = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const restaurantId = params.id;

  // Pour les menus, vérifier l'authentification n'est pas nécessaire
  // car ils sont accessibles publiquement
  const catégories = await prisma.catégorie.findMany({
    where: {
      restaurant_id: restaurantId,
      actif: true
    },
    orderBy: { ordre: 'asc' },
    include: {
      menus: {
        where: { actif: true },
        include: {
          options: true
        }
      }
    }
  });

  return Response.json({ catégories });
});

// Créer un nouveau menu ou une catégorie
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

  if (!access.permissions.includes(PERMISSIONS.MENU.CRÉER) &&
      access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  const data = await req.json();
  const type = data.type || "menu"; // "menu" ou "catégorie"

  if (type === "catégorie") {
    // Valider les données de catégorie
    const validationResult = schemaCatégorie.safeParse(data);

    if (!validationResult.success) {
      throw new ApiError(validationResult.error.issues[0].message);
    }

    // Créer une nouvelle catégorie
    const catégorie = await prisma.catégorie.create({
      data: {
        restaurant_id: restaurantId,
        nom: validationResult.data.nom,
        description: validationResult.data.description,
        ordre: validationResult.data.ordre,
        actif: validationResult.data.actif,
      },
    });

    return Response.json(
      { success: true, catégorie },
      { status: 201 }
    );
  } else {
    // Valider les données de menu
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

    console.log("Uploading image with:", {
  image_url: image_url?.slice(0, 100), // show part of base64
  type: typeof image_url,
  length: image_url?.length,
});

    const MenuImage = await uploadToCloudinary(image_url!, `restaurants/${restaurantId}/image_url`);

    // Créer un nouveau menu avec ses options
    const menu = await prisma.menu.create({
      data: {
        restaurant_id: restaurantId,
        catégorie_id,
        nom,
        description,
        prix,
        image_url: MenuImage,
        actif,
        options: options ? {
          create: options.map((opt: any) => ({
            nom: opt.nom,
            prix_supplément: opt.prix_supplément,
          }))
        } : undefined,
      },
      include: {
        options: true,
      },
    });

    return Response.json(
      { success: true, menu },
      { status: 201 }
    );
  }
});