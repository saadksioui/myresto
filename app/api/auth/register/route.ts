import { RÔLE_PERMISSIONS } from '@/lib/rbac';
import { NextRequest } from "next/server";
import { schemaInscription } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { apiHandler } from "@/lib/utils";

export const POST = apiHandler(async (req: NextRequest) => {
  const data = await req.json();

  // Valider les données
  const validationResult = schemaInscription.safeParse(data);

  if (!validationResult.success) {
    return Response.json(
      { error: validationResult.error.issues[0].message },
      { status: 400 }
    );
  }

  const { email, mot_de_passe, nom, prénom } = validationResult.data;

  // Vérifier si l'utilisateur existe déjà
  const utilisateurExistant = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (utilisateurExistant) {
    return Response.json(
      { error: "Cet email est déjà utilisé" },
      { status: 400 }
    );
  }

  // Hasher le mot de passe
  const mot_de_passe_hash = await bcrypt.hash(mot_de_passe, 10);

  // Créer l'utilisateur
  const utilisateur = await prisma.utilisateur.create({
    data: {
      email,
      mot_de_passe_hash,
      nom,
      prénom,
    },
  });

  // Trouver le rôle de propriétaire
    let rôlePropriétaire = await prisma.rôle.findFirst({
      where: { nom: "propriétaire" },
    });

    // Créer le rôle propriétaire s'il n'existe pas
    if (!rôlePropriétaire) {
      rôlePropriétaire = await prisma.rôle.create({
        data: {
          nom: "propriétaire",
          permissions: RÔLE_PERMISSIONS.PROPRIÉTAIRE,
        },
      });
    }
    // Créer le restaurant et associer l'utilisateur
  const restaurant = await prisma.$transaction(async (tx) => {
    // Créer le restaurant
    const newRestaurant = await tx.restaurant.create({
      data: {
        nom: "Nouveau Restaurant",
        slug: `restaurant-${Date.now()}`,
        type: "standard", // Remplacez par la valeur par défaut ou appropriée
        étape_configuration: 1,
      },
    });

    // Associer l'utilisateur au restaurant avec le rôle propriétaire
    await tx.userResto.create({
      data: {
        user_id: utilisateur.id,
        restaurant_id: newRestaurant.id,
        rôle_id: rôlePropriétaire.id,
      },
    });

    // Créer un abonnement gratuit par défaut
    await tx.abonnement.create({
      data: {
        restaurant_id: newRestaurant.id,
        type: "gratuit",
        statut: "actif",
        date_début: new Date(),
        date_fin: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
      },
    });

    return newRestaurant;
  });

  // Remove password from response
  const { mot_de_passe_hash: _, ...utilisateurWithoutPassword } = utilisateur;

  return Response.json(
    {
      success: true,
      id: utilisateur.id,
      email: utilisateur.email
    },
    { status: 201 }
  );
});