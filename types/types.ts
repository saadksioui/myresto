export type OrderStatus = "en_attente" | "en_préparation" | "assignée" | "livrée" | "annulée";

export type GeneralSettings = {
  nom: string;
  type: string;
  logo: string | File | null;
  banniére: string | File | null;
  min_commande: number;
  whatsapp_commande: boolean;
};

export type ProfilSettings = {
  nom_gérant: string;
  téléphone: string;
  email: string;
  langue: string;
  facebook: string;
  instagram: string;
}

export type PaiementSettings = {
  livraison: boolean;
  frais_livraison: number;
  min_commande: number;
  espèce: boolean;
}
