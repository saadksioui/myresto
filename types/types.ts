export type OrderStatus = "en_attente" | "en_préparation" | "assignée" | "livrée" | "annulée";

export type RestaurantPublicData = {
  général: {
    id: string;
    nom: string;
    slug: string;
    type: string;
    logo_url: string | null;
    bannière_url: string | null;
    min_commande: number | null;
    whatsapp_commande: string | null;
    notifications_sonores: boolean;
  };
  profil: {
    description: string;
    site_web?: string;
    téléphone?: string;
    email?: string;
    // Add more fields based on your schema
  } | null;
  paiement: {
    livraison: boolean;
    frais_livraison: number;
    min_commande: number;
    espèce: boolean;
    cb: boolean;
    paypal: boolean;
  } | null;
  lieux: {
    id: string;
    adresse: string;
    actif: boolean;
    horaires: {
      id: string;
      jour_semaine: number;
      ouverture: string;
      fermeture: string;
      activé: boolean;
    }[];
  }[];
  abonnement: {
    id: string;
    type: string;
    statut: string;
    expire_le: string;
    // Add more fields based on your schema
  } | null;
};
