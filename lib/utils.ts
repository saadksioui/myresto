import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import QRCode from "qrcode"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Gestionnaire d'erreur API
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Wrapper pour les gestionnaires d'API
export function apiHandler(handler: Function) {
  return async (req: Request, params: any) => {
    try {
      return await handler(req, params);
    } catch (error) {
      console.error("API error:", error);

      if (error instanceof ApiError) {
        return Response.json(
          { error: error.message },
          { status: error.status }
        );
      }

      if (error instanceof Error) {
        return Response.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return Response.json(
        { error: "Une erreur inattendue s'est produite" },
        { status: 500 }
      );
    }
  };
}

// Génération de QR code
export async function generateQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error("Erreur de génération de QR code:", error);
    throw new ApiError("Impossible de générer le QR code", 500);
  }
}

// Calculer le total d'une commande
export function calculerTotalCommande(
  détails: Array<{
    quantité: number;
    prix_unitaire: number;
  }>,
  fraisLivraison: number = 0
): number {
  const sousTotal = détails.reduce(
    (total, item) => total + item.quantité * item.prix_unitaire,
    0
  );

  return sousTotal + fraisLivraison;
}