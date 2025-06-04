import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";
import { checkUserRestaurantAccess } from "@/lib/restaurants";
import { apiHandler, ApiError, calculerTotalCommande } from "@/lib/utils";
import { schemaCommande } from "@/lib/validation";
import { PERMISSIONS } from "@/lib/rbac";

// Récupérer toutes les commandes d'un restaurant
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

  if (!access.permissions.includes(PERMISSIONS.COMMANDE.LIRE) &&
    access.rôle !== "propriétaire") {
    throw new ApiError("Permission refusée", 403);
  }

  const searchParams = req.nextUrl.searchParams;
  const statut = searchParams.get('statut');
  const limit = parseInt(searchParams.get('limit') || '100');
  const page = parseInt(searchParams.get('page') || '1');
  const skip = (page - 1) * limit;

  // Construire la requête
  const where = {
    restaurant_id: restaurantId,
    ...(statut ? { statut } : {}),
  };

  // Récupérer les commandes
  const [commandes, total] = await Promise.all([
    prisma.commande.findMany({
      where,
      include: {
        client: true,
        livreur: true,
        détails: {
          include: {
            menu: true,
          },
        },
      },
      orderBy: {
        créé_le: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.commande.count({ where }),
  ]);

  return Response.json({
    commandes,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
});

// Créer une nouvelle commande
export const POST = apiHandler(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const restaurantId = params.id;
  const data = await req.json();

  // Valider les données
  const validationResult = schemaCommande.safeParse(data);

  if (!validationResult.success) {
    throw new ApiError(validationResult.error.issues[0].message);
  }

  const {
    client_id,
    détails: détailsCommande,
    frais_livraison,
    notes,
    mode_paiement,
  } = validationResult.data;

  // Vérifier que le restaurant existe
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    include: {
      paiement: true,
    },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  // Récupérer les informations des menus pour calculer le total
  const menuIds = détailsCommande.map((d: any) => d.menu_id);
  const menus = await prisma.menu.findMany({
    where: {
      id: { in: menuIds },
      restaurant_id: restaurantId,
      actif: true,
    },
    include: {
      options: true,
    },
  });

  if (menus.length !== menuIds.length) {
    throw new ApiError("Certains menus n'existent pas ou ne sont pas actifs");
  }

  // Préparer les détails de commande avec prix
  const détailsAvecPrix = détailsCommande.map((détail: any) => {
    const menu = menus.find((m) => m.id === détail.menu_id);
    if (!menu) throw new ApiError(`Menu introuvable: ${détail.menu_id}`);

    return {
      menu_id: détail.menu_id,
      quantité: détail.quantité,
      prix_unitaire: menu.prix,
      options: détail.options ? JSON.stringify(détail.options) : null,
      notes: détail.notes,
    };
  });

  // Calculer le total
  const total = calculerTotalCommande(
    détailsAvecPrix.map((d: any) => ({
      quantité: d.quantité,
      prix_unitaire: Number(d.prix_unitaire),
    })),
    Number(frais_livraison || 0)
  );

  // Créer la commande
  const commande = await prisma.commande.create({
    data: {
      restaurant_id: restaurantId,
      client_id,
      statut: "en_attente",
      total,
      frais_livraison: frais_livraison || 0,
      notes,
      mode_paiement,
      statut_paiement: "en_attente",
      détails: {
        create: détailsAvecPrix,
      },
    },
    include: {
      client: true,
      détails: {
        include: {
          menu: true,
        },
      },
    },
  });

  return Response.json(
    { success: true, commande },
    { status: 201 }
  );
})