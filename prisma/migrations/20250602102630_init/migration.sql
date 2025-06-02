/*
  Warnings:

  - You are about to drop the `Abonnement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Commande` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Livreur` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Menu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Paiement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rôle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Utilisateur` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Abonnement" DROP CONSTRAINT "Abonnement_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_client_id_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_livreur_id_fkey";

-- DropForeignKey
ALTER TABLE "Commande" DROP CONSTRAINT "Commande_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Livreur" DROP CONSTRAINT "Livreur_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_commande_id_fkey";

-- DropForeignKey
ALTER TABLE "Paiement" DROP CONSTRAINT "Paiement_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_restaurant_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_rôle_id_fkey";

-- DropForeignKey
ALTER TABLE "UserResto" DROP CONSTRAINT "UserResto_user_id_fkey";

-- DropTable
DROP TABLE "Abonnement";

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "Commande";

-- DropTable
DROP TABLE "Livreur";

-- DropTable
DROP TABLE "Menu";

-- DropTable
DROP TABLE "Paiement";

-- DropTable
DROP TABLE "Restaurant";

-- DropTable
DROP TABLE "Rôle";

-- DropTable
DROP TABLE "Utilisateur";

-- CreateTable
CREATE TABLE "Utilisateurs" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe_hash" TEXT NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "téléphone" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurants" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL,
    "bannière_url" TEXT NOT NULL,
    "min_commande" DECIMAL(65,30) NOT NULL,
    "whatsapp_commande" BOOLEAN NOT NULL,
    "notifications_sonores" BOOLEAN NOT NULL,
    "créé_le" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abonnements" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "date_début" TIMESTAMP(3) NOT NULL,
    "date_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abonnements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rôles" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,

    CONSTRAINT "Rôles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Menus" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prix" DECIMAL(65,30) NOT NULL,
    "actif" BOOLEAN NOT NULL,

    CONSTRAINT "Menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commandes" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "statut" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "livreur_id" TEXT,

    CONSTRAINT "Commandes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livreurs" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "téléphone" TEXT NOT NULL,

    CONSTRAINT "Livreurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiements" (
    "restaurant_id" TEXT NOT NULL,
    "livraison" BOOLEAN NOT NULL,
    "cb" BOOLEAN NOT NULL,
    "paypal" BOOLEAN NOT NULL,
    "email_paypal" TEXT NOT NULL,

    CONSTRAINT "Paiements_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Profils" (
    "restaurant_id" TEXT NOT NULL,
    "nom_gérant" TEXT NOT NULL,
    "téléphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "langue" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "instagram" TEXT NOT NULL,

    CONSTRAINT "Profils_pkey" PRIMARY KEY ("restaurant_id")
);

-- CreateTable
CREATE TABLE "Lieux" (
    "id" TEXT NOT NULL,
    "restaurant_id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,

    CONSTRAINT "Lieux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horaires" (
    "id" TEXT NOT NULL,
    "lieu_id" TEXT NOT NULL,
    "jour_semaine" INTEGER NOT NULL,
    "activé" BOOLEAN NOT NULL,
    "heure_ouverture" TIMESTAMP(3) NOT NULL,
    "heure_fermeture" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Horaires_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateurs_email_key" ON "Utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurants_slug_key" ON "Restaurants"("slug");

-- AddForeignKey
ALTER TABLE "Abonnements" ADD CONSTRAINT "Abonnements_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResto" ADD CONSTRAINT "UserResto_rôle_id_fkey" FOREIGN KEY ("rôle_id") REFERENCES "Rôles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menus" ADD CONSTRAINT "Menus_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commandes" ADD CONSTRAINT "Commandes_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commandes" ADD CONSTRAINT "Commandes_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commandes" ADD CONSTRAINT "Commandes_livreur_id_fkey" FOREIGN KEY ("livreur_id") REFERENCES "Livreurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livreurs" ADD CONSTRAINT "Livreurs_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiements" ADD CONSTRAINT "Paiements_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profils" ADD CONSTRAINT "Profils_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lieux" ADD CONSTRAINT "Lieux_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "Restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horaires" ADD CONSTRAINT "Horaires_lieu_id_fkey" FOREIGN KEY ("lieu_id") REFERENCES "Lieux"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
