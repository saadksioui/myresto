import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiHandler, ApiError, calculerTotalCommande } from "@/lib/utils";
import { schemaCommande } from "@/lib/validation";

// Créer une commande pour un restaurent (public)
export const POST = apiHandler(async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  // Récupérer le restaurant
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      paiement: true,
    },
  });

  if (!restaurant) {
    throw new ApiError("Restaurant non trouvé", 404);
  }

  const data = await req.json();

  // Valider les données
  const validationResult = schemaCommande.safeParse({
    ...data,
    restaurant_id: restaurant.id,
  });

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

  // Vérifier que le client existe
  const client = await prisma.client.findUnique({
    where: { id: client_id },
  });

  if (!client) {
    throw new ApiError("Client non trouvé", 404);
  }

  // Récupérer les informations des menus pour calculer le total
  const menuIds = détailsCommande.map((d: any) => d.menu_id);
  const menus = await prisma.menu.findMany({
    where: {
      id: { in: menuIds },
      restaurant_id: restaurant.id,
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

  // Vérifier la commande minimale
  const minCommande = restaurant.paiement?.min_commande || 0;

  if (Number(total) < Number(minCommande)) {
    throw new ApiError(`La commande minimale est de ${minCommande}`);
  }

  // Créer la commande
  const commande = await prisma.commande.create({
    data: {
      restaurant_id: restaurant.id,
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