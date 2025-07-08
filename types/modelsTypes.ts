export type Utilisateur = {
  id: string;
  email: string;
  mot_de_passe_hash: string;
  nom?: string | null;
  prénom?: string | null;
  créé_le: string;
  modifié_le: string;
  userResto: UserResto[];
};

export type Client = {
  id: string;
  nom: string;
  téléphone: string;
  email?: string | null;
  adresse: string;
  créé_le: string;
  modifié_le: string;
  commandes: Commande[];
};

export type Restaurant = {
  id: string;
  nom: string;
  slug: string;
  type: string;
  logo_url?: string | null;
  bannière_url?: string | null;
  min_commande?: string | null; // Decimal as string
  whatsapp_commande: boolean;
  notifications_sonores: boolean;
  étape_configuration: number;
  créé_le: string;
  modifié_le: string;
  abonnement?: Abonnement | null;
  menus: Menu[];
  catégories: Catégorie[];
  livreurs: Livreur[];
  commandes: Commande[];
  userResto: UserResto[];
  profil?: Profil | null;
  lieux: Lieu[];
  paiement?: Paiement | null;
  horaires: Horaire[];
};

export type Abonnement = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  type: string;
  statut: string;
  date_début: string;
  date_fin: string;
  créé_le: string;
  modifié_le: string;
};

export type Rôle = {
  id: string;
  nom: string;
  permissions: string[];
  userResto: UserResto[];
};

export type UserResto = {
  user_id: string;
  restaurant_id: string;
  rôle_id: string;
  créé_le: string;
  utilisateur: Utilisateur;
  restaurant: Restaurant;
  rôle: Rôle;
};

export type Catégorie = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  nom: string;
  description?: string | null;
  ordre: number;
  actif: boolean;
  menus: Menu[];
  créé_le: string;
  modifié_le: string;
};

export type Menu = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  catégorie_id?: string | null;
  catégorie?: Catégorie | null;
  nom: string;
  description?: string | null;
  prix: string; // Decimal as string
  image_url?: string | null;
  actif: boolean;
  options: Option[];
  détails_commande: DétailCommande[];
  créé_le: string;
  modifié_le: string;
};

export type Option = {
  id: string;
  menu_id: string;
  menu: Menu;
  nom: string;
  prix_supplément: string; // Decimal as string
  créé_le: string;
  modifié_le: string;
};

export type Commande = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  client_id: string;
  client: Client;
  statut: string;
  total: string; // Decimal as string
  frais_livraison: string; // Decimal as string
  notes?: string | null;
  mode_paiement?: string | null;
  statut_paiement?: string | null;
  livreur_id?: string | null;
  livreur?: Livreur | null;
  détails: DétailCommande[];
  créé_le: string;
  modifié_le: string;
};

export type DétailCommande = {
  id: string;
  commande_id: string;
  commande: Commande;
  menu_id: string;
  menu: Menu;
  quantité: number;
  prix_unitaire: string; // Decimal as string
  options?: string | null;
  notes?: string | null;
  créé_le: string;
  modifié_le: string;
};

export type Livreur = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  nom: string;
  téléphone: string;
  email?: string | null;
  actif: boolean;
  commandes: Commande[];
  créé_le: string;
  modifié_le: string;
};

export type Paiement = {
  restaurant_id: string;
  restaurant: Restaurant;
  livraison: boolean;
  frais_livraison: string; // Decimal as string
  min_commande: string; // Decimal as string
  espèce: boolean;
  cb: boolean;
  paypal: boolean;
  email_paypal?: string | null;
  clé_api_cb?: string | null;
  créé_le: string;
  modifié_le: string;
};

export type Profil = {
  restaurant_id: string;
  restaurant: Restaurant;
  nom_gérant?: string | null;
  téléphone?: string | null;
  email?: string | null;
  langue: string;
  facebook?: string | null;
  instagram?: string | null;
  site_web?: string | null;
  créé_le: string;
  modifié_le: string;
};

export type Lieu = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  nom: string;
  whatsapp?: string | null;
  adresse: string;
  latitude?: number | null;
  longitude?: number | null;
  principal: boolean;
  actif: boolean;
  horaires: Horaire[];
  créé_le: string;
  modifié_le: string;
};

export type Horaire = {
  id: string;
  restaurant_id: string;
  restaurant: Restaurant;
  lieu_id?: string | null;
  lieu?: Lieu | null;
  jour_semaine: number;
  activé: boolean;
  heure_ouverture: string;
  heure_fermeture: string;
  créé_le: string;
  modifié_le: string;
};