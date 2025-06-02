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