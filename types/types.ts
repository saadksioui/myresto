import { Lieu } from "./modelsTypes";

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

export type HoursSettings = {
  restaurant_id: string;
  lieu_id: string;
  lieu: Lieu;
  jour_semaine: number;       // 0 (Dimanche) - 6 (Samedi)
  activé: boolean;
  heure_ouverture: string;    // Format "HH:MM"
  heure_fermeture: string;    // Format "HH:MM"
  cree_le: Date;
  modifie_le: Date;
};
