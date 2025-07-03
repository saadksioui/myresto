"use client"
import { useRestaurant } from "@/context/RestaurantContext";
import { useEffect, useState } from "react";
import KPICard from "../_components/dashboard/KPICard";
import { Bike, DollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";

interface Commande {
  total: number;
  // add other commande fields if needed
}

interface MenuItem {
  actif: boolean;
  // add other menu item fields if needed
}

interface Livreur {
  actif: boolean;
  // add other livreur fields if needed
}

interface Restaurant {
  id: string;
  nom: string;
  commande: Commande[];
  menu: MenuItem[];
  livreurs: Livreur[];
}

const DashboardPage = () => {
  const { selectedRestaurant } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!selectedRestaurant) return;
      const res = await fetch(`/api/restaurants/${selectedRestaurant}`);
      const data = await res.json();
      setRestaurant(data.restaurant);
    };
    fetchRestaurant();
  }, [selectedRestaurant]);

  const totalRevenue = restaurant?.commande?.reduce((sum, commande) => sum + commande.total, 0) || 0;
  const totalCommandes = restaurant?.commande?.length || 0;
  const activeMenuItems = restaurant?.menu?.filter(item => item.actif).length || 0;
  const activeLivreurs = restaurant?.livreurs?.filter(livreur => livreur.actif).length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your restaurant management dashboard {restaurant?.nom && `for ${restaurant.nom}`}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} Dhs`}
          icon={<DollarSign size={18} className="text-[#2563EB]" />}
          colorClass="text-[#2563EB]"
        />

        <KPICard
          title="Total Commande"
          value={`${totalCommandes} Commande`}
          icon={<ShoppingBag size={18} className="text-[#F97316]" />}
          colorClass="text-[#F97316]"
        />

        <KPICard
          title="Active Menu Items"
          value={`${activeMenuItems} Items`}
          icon={<UtensilsCrossed size={18} className="text-[#3B82F6]" />}
          colorClass="text-[#3B82F6]"
        />

        <KPICard
          title="Delivery Personnel"
          value={`${activeLivreurs} Livreurs`}
          icon={<Bike size={18} className="text-[#F59E0B]" />}
          colorClass="text-[#F59E0B]"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
