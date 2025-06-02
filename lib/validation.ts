import { z } from "zod";

// Schémas de validation pour l'authentification
export const schemaInscription = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(8, "Mot de passe trop court (min 8 caractères)"),
  nom: z.string().optional(),
  prénom: z.string().optional(),
});

export const schemaConnexion = z.object({
  email: z.string().email("Email invalide"),
  mot_de_passe: z.string().min(1, "Mot de passe requis"),
});

// Schémas de validation pour les restaurants
export const schemaConfigurationÉtape1 = z.object({
  nom: z.string().min(2, "Nom trop court (min 2 caractères)"),
  type: z.string().min(2, "Type de restaurant requis"),
  slug: z.string().optional(),
});

export const schemaConfigurationÉtape2 = z.object({
  whatsapp_commande: z.boolean().default(false),
  adresse: z.string().min(5, "Adresse requise"),
  téléphone: z.string().min(8, "Numéro de téléphone requis"),
});

export const schemaConfigurationÉtape3 = z.object({
  logo_url: z.string().url("URL de logo invalide").optional(),
  bannière_url: z.string().url("URL de bannière invalide").optional(),
});

// Schémas de validation pour les menus
export const schemaCatégorie = z.object({
  nom: z.string().min(2, "Nom trop court (min 2 caractères)"),
  description: z.string().optional(),
  ordre: z.number().int().optional(),
  actif: z.boolean().default(true),
});

export const schemaMenu = z.object({
  nom: z.string().min(2, "Nom trop court (min 2 caractères)"),
  description: z.string().optional(),
  prix: z.number().positive("Prix doit être positif"),
  catégorie_id: z.string().uuid("ID de catégorie invalide").optional(),
  image_url: z.string().url("URL d'image invalide").optional(),
  actif: z.boolean().default(true),
  options: z.array(
    z.object({
      nom: z.string().min(1, "Nom d'option requis"),
      prix_supplément: z.number().default(0),
    })
  ).optional(),
});

// Schémas de validation pour les commandes
export const schemaCommande = z.object({
  client_id: z.string().uuid("ID client invalide"),
  restaurant_id: z.string().uuid("ID restaurant invalide"),
  détails: z.array(
    z.object({
      menu_id: z.string().uuid("ID menu invalide"),
      quantité: z.number().int().positive("Quantité doit être positive"),
      options: z.array(z.string()).optional(),
      notes: z.string().optional(),
    })
  ),
  frais_livraison: z.number().default(0),
  notes: z.string().optional(),
  mode_paiement: z.enum(["espèce", "cb", "paypal"]).optional(),
});

export const schemaMiseÀJourStatutCommande = z.object({
  statut: z.enum([
    "en_attente",
    "en_préparation",
    "assignée",
    "livrée",
    "annulée"
  ]),
  livreur_id: z.string().uuid("ID livreur invalide").optional(),
});

// Schémas de validation pour les livreurs
export const schemaLivreur = z.object({
  nom: z.string().min(2, "Nom trop court (min 2 caractères)"),
  téléphone: z.string().min(8, "Numéro de téléphone requis"),
  email: z.string().email("Email invalide").optional(),
  actif: z.boolean().default(true),
});

// Schémas de validation pour les paramètres
export const schemaPaiement = z.object({
  livraison: z.boolean().default(true),
  frais_livraison: z.number().default(0),
  min_commande: z.number().default(0),
  espèce: z.boolean().default(true),
  cb: z.boolean().default(false),
  paypal: z.boolean().default(false),
  email_paypal: z.string().email("Email PayPal invalide").optional(),
  clé_api_cb: z.string().optional(),
});

export const schemaProfil = z.object({
  nom_gérant: z.string().optional(),
  téléphone: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  langue: z.string().default("fr"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  site_web: z.string().url("URL de site web invalide").optional(),
});

export const schemaHoraire = z.object({
  jour_semaine: z.number().int().min(0).max(6),
  activé: z.boolean().default(true),
  heure_ouverture: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)"),
  heure_fermeture: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format d'heure invalide (HH:MM)"),
  lieu_id: z.string().uuid("ID lieu invalide").optional(),
});

export const schemaLieu = z.object({
  nom: z.string().min(2, "Nom trop court (min 2 caractères)"),
  adresse: z.string().min(5, "Adresse requise"),
  whatsapp: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  principal: z.boolean().default(false),
  actif: z.boolean().default(true),
});