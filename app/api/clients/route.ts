import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { apiHandler, ApiError } from "@/lib/utils";


// Créer un nouveau client (public)
export const POST = apiHandler(async (
  req: NextRequest
) => {
  const data = await req.json();

  // Valider les données minimales
  if (!data.nom || !data.téléphone || !data.adresse) {
    throw new ApiError("Nom, téléphone et adresse dont requis");
  }

  const {
    nom,
    téléphone,
    adresse,
    email
  } = data;

  // Vérifier si le client existe déjà avec ce numéro de téléphone
  const clientExistant = await prisma.client.findFirst({
    where: { téléphone },
  });

  if (clientExistant) {
    // Retourner le client existant
    return Response.json(
      { success: true, client: clientExistant, nouveau: false },
    )
  }

  // Créer un nouveau client
  const client = await prisma.client.create({
    data: {
      nom,
      téléphone,
      email,
      adresse,
    },
  });

  return Response.json(
    { success: true, client, nouveau: true },
    { status: 201 }
  );
}
)