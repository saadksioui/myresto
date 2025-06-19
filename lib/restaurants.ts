import prisma from "./prisma";

interface UserRestaurantAccess {
  hasAccess: boolean;
  rôle: string | null;
  permissions: string[];
}

// Récupérer tous les restaurants d'un utilisateur avec leurs rôles
export async function getUserRestaurants(userId: string) {
  const userRestos = await prisma.userResto.findMany({
    where: { user_id: userId },
    include: {
      restaurant: true,
      rôle: true,
    },
  });

  return userRestos.map((ur) => ({
    id: ur.restaurant.id,
    nom: ur.restaurant.nom,
    slug: ur.restaurant.slug,
    logo: ur.restaurant.logo_url,
    rôle: {
      id: ur.rôle.id,
      nom: ur.rôle.nom,
      permissions: ur.rôle.permissions,
    },
  }));
}

// Vérifier si un utilisateur a accès à un restaurant spécifique
export async function checkUserRestaurantAccess(userId: string, restaurantId: string): Promise<UserRestaurantAccess> {
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

  return userResto ? {
    hasAccess: true,
    rôle: userResto.rôle.nom,
    permissions: userResto.rôle.permissions,
  } : {
    hasAccess: false,
    rôle: null,
    permissions: [],
  };
}

// Vérifier si un slug de restaurant est disponible
export async function isSlugAvailable(slug: string, excludeRestaurantId?: string) {
  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug,
      ...(excludeRestaurantId ? { id: { not: excludeRestaurantId } } : {}),
    },
  });

  return !restaurant;
}

// Générer un slug unique pour un restaurant
export async function generateUniqueSlug(nom: string) {
  let slug = nom
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Vérifier si le slug existe déjà
  const slugExists = await prisma.restaurant.findUnique({
    where: { slug },
  });

  // Si le slug existe déjà, ajouter un nombre aléatoire
  if (slugExists) {
    slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
  }

  return slug;
}