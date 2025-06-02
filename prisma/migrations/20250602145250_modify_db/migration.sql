/*
  Warnings:

  - You are about to drop the `Abonnements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Commandes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Horaires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lieux` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Livreurs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paiements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profils` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rôles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utilisateurs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abonnements" DROP CONSTRAINT "Abonnements_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Commandes" DROP CONSTRAINT "Commandes_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Commandes" DROP CONSTRAINT "Commandes_livreur_id_fkey";

-- DropForeignKey
ALTER TABLE "Commandes" DROP CONSTRAINT "Commandes_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Horaires" DROP CONSTRAINT "Horaires_lieu_id_fkey";

-- DropForeignKey
ALTER TABLE "Lieux" DROP CONSTRAINT "Lieux_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Livreurs" DROP CONSTRAINT "Livreurs_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Menus" DROP CONSTRAINT "Menus_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiements" DROP CONSTRAINT "Paiements_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Profils" DROP CONSTRAINT "Profils_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_rôle_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_user_id_fkey";

-- AlterTable
ALTER TABLE "UserResto" ADD COLUMN     "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Abonnements";

-- DropTable
DROP TABLE "Clients";

-- DropTable
DROP TABLE "Commandes";

-- DropTable
DROP TABLE "Horaires";

-- DropTable
DROP TABLE "Lieux";

-- DropTable
DROP TABLE "Livreurs";

-- DropTable
DROP TABLE "Menus";

-- DropTable
DROP TABLE "Paiements";

-- DropTable
DROP TABLE "Profils";

-- DropTable
DROP TABLE "Restaurants";

-- DropTable
DROP TABLE "Rôles";

-- DropTable
DROP TABLE "Utilisateurs";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe_hash" TEXT NOT NULL,
    "nom" TEXT,
    "prénom" TEXT,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "téléphone" TEXT NOT NULL,
    "email" TEXT,
    "adresse" TEXT NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo_url" TEXT,
    "bannière_url" TEXT,
    "min_commande" DECIMAL(65,30) DEFAULT 0,
    "whatsapp_commande" BOOLEAN NOT NULL DEFAULT false,
    "notifications_sonores" BOOLEAN NOT NULL DEFAULT true,
    "étape_configuration" INTEGER NOT NULL DEFAULT 1,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abonnement" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "date_début" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rôle" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "permissions" TEXT[],

    CONSTRAINT "Rôle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Catégorie" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Catégorie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menu" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "catégorie_id" TEXT,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" DECIMAL(65,30) NOT NULL,
    "image_url" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prix_supplément" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "frais_livraison" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "mode_paiement" TEXT,
    "statut_paiement" TEXT,
    "livreur_id" TEXT,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DétailCommande" (
    "id" TEXT NOT NULL,
    "commande_id" TEXT NOT NULL,
    "menu_id" TEXT NOT NULL,
    "quantité" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(65,30) NOT NULL,
    "options" TEXT,
    "notes" TEXT,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DétailCommande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livreur" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "téléphone" TEXT NOT NULL,
    "email" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livreur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "restaurant_id" TEXT NOT NULL,
    "livraison" BOOLEAN NOT NULL DEFAULT true,
    "frais_livraison" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "min_commande" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "espèce" BOOLEAN NOT NULL DEFAULT true,
    "cb" BOOLEAN NOT NULL DEFAULT false,
    "paypal" BOOLEAN NOT NULL DEFAULT false,
    "email_paypal" TEXT,
    "clé_api_cb" TEXT,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Profil" (
    "restaurant_id" TEXT NOT NULL,
    "nom_gérant" TEXT,
    "téléphone" TEXT,
    "email" TEXT,
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "facebook" TEXT,
    "instagram" TEXT,
    "site_web" TEXT,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profil_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Lieu" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "whatsapp" TEXT,
    "adresse" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lieu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horaire" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "lieu_id" TEXT,
    "jour_semaine" INTEGER NOT NULL,
    "activé" BOOLEAN NOT NULL DEFAULT true,
    "heure_ouverture" TEXT NOT NULL,
    "heure_fermeture" TEXT NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifié_le" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_slug_key" ON "Restaurant"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Abonnement_restaurant_id_key" ON "Abonnement"("restaurant_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rôle_nom_key" ON "Rôle"("nom");

-- AddForeignKey
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_rôle_id_fkey" FOREIGN KEY ("rôle_id") REFERENCES "Rôle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Catégorie" ADD CONSTRAINT "Catégorie_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_catégorie_id_fkey" FOREIGN KEY ("catégorie_id") REFERENCES "Catégorie"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_livreur_id_fkey" FOREIGN KEY ("livreur_id") REFERENCES "Livreur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DétailCommande" ADD CONSTRAINT "DétailCommande_commande_id_fkey" FOREIGN KEY ("commande_id") REFERENCES "Commande"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DétailCommande" ADD CONSTRAINT "DétailCommande_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livreur" ADD CONSTRAINT "Livreur_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profil" ADD CONSTRAINT "Profil_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lieu" ADD CONSTRAINT "Lieu_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horaire" ADD CONSTRAINT "Horaire_lieu_id_fkey" FOREIGN KEY ("lieu_id") REFERENCES "Lieu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
