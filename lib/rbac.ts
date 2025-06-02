import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { checkUserRestaurantAccess } from "./restaurants";

// Vérifier si l'utilisateur a la permission requise pour un restaurant
export async function hasPermission(userId: string, restaurantId: string, permission: string) {
  const access = await checkUserRestaurantAccess(userId, restaurantId);

  if (!access.hasAccess) return false;

  // Ensure permissions is typed as string[]
  const permissions: string[] = access.permissions as string[];

  return permissions.includes(permission) ||
         permissions.includes("*") ||
         access.rôle === "propriétaire";
}

// Middleware pour vérifier les permissions
export async function checkPermission(
  req: NextRequest,
  permission: string,
  getRestaurantId: (req: NextRequest) => string | null
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const restaurantId = getRestaurantId(req);

    if (!restaurantId) {
      return NextResponse.json(
        { error: "ID de restaurant manquant" },
        { status: 400 }
      );
    }

    const hasAccess = await hasPermission(
      token.id as string,
      restaurantId,
      permission
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Permission refusée" },
        { status: 403 }
      );
    }

    return null; // Permission accordée
  } catch (error) {
    console.error("Erreur de vérification de permission:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Liste des permissions disponibles
export const PERMISSIONS = {
  RESTAURANT: {
    CONFIGURER: "restaurant.configurer",
    LIRE: "restaurant.lire",
    MODIFIER: "restaurant.modifier"
  },
  MENU: {
    LIRE: "menu.lire",
    CRÉER: "menu.créer",
    MODIFIER: "menu.modifier",
    SUPPRIMER: "menu.supprimer"
  },
  COMMANDE: {
    LIRE: "commande.lire",
    CRÉER: "commande.créer",
    MODIFIER: "commande.modifier",
    ASSIGNER: "commande.assigner"
  },
  LIVREUR: {
    LIRE: "livreur.lire",
    CRÉER: "livreur.créer",
    MODIFIER: "livreur.modifier",
    SUPPRIMER: "livreur.supprimer"
  },
  PARAMÈTRES: {
    LIRE: "paramètres.lire",
    MODIFIER: "paramètres.modifier"
  },
  UTILISATEUR: {
    INVITER: "utilisateur.inviter",
    MODIFIER_RÔLE: "utilisateur.modifier_rôle",
    SUPPRIMER: "utilisateur.supprimer"
  }
};

// Permissions par défaut pour chaque rôle
export const RÔLE_PERMISSIONS = {
  PROPRIÉTAIRE: ["*"], // Toutes les permissions

  STAFF: [
    PERMISSIONS.RESTAURANT.LIRE,
    PERMISSIONS.RESTAURANT.MODIFIER,
    PERMISSIONS.MENU.LIRE,
    PERMISSIONS.MENU.CRÉER,
    PERMISSIONS.MENU.MODIFIER,
    PERMISSIONS.MENU.SUPPRIMER,
    PERMISSIONS.COMMANDE.LIRE,
    PERMISSIONS.COMMANDE.CRÉER,
    PERMISSIONS.COMMANDE.MODIFIER,
    PERMISSIONS.COMMANDE.ASSIGNER,
    PERMISSIONS.LIVREUR.LIRE,
    PERMISSIONS.LIVREUR.CRÉER,
    PERMISSIONS.LIVREUR.MODIFIER,
    PERMISSIONS.LIVREUR.SUPPRIMER,
    PERMISSIONS.PARAMÈTRES.LIRE,
    PERMISSIONS.PARAMÈTRES.MODIFIER,
    PERMISSIONS.UTILISATEUR.INVITER
  ],

  LIVREUR: [
    PERMISSIONS.RESTAURANT.LIRE,
    PERMISSIONS.MENU.LIRE,
    PERMISSIONS.COMMANDE.LIRE,
    PERMISSIONS.COMMANDE.MODIFIER,
    PERMISSIONS.LIVREUR.LIRE,
    PERMISSIONS.PARAMÈTRES.LIRE
  ]
};
