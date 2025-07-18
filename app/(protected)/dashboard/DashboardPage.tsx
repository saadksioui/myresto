"use client"
import { useRestaurant } from "@/context/RestaurantContext";
import { useEffect, useState } from "react";
import KPICard from "../_components/dashboard/KPICard";
import { Bike, DollarSign, ShoppingBag, UtensilsCrossed } from "lucide-react";
import CreationProcessForRestaurant from "../_components/CreationProcessForRestaurant";
import RevenueChart from "../_components/dashboard/RevenueChart";
import RecentOrdersTable from "../_components/dashboard/RecentOrdersTable";

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
  étape_configuration: number;
  commandes: Commande[];
  menus: MenuItem[];
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
  console.log(restaurant);

  const totalRevenue = restaurant?.commandes?.reduce((sum, commande) => sum + commande.total, 0) || 0;
  const totalCommandes = restaurant?.commandes?.length || 0;
  const activeMenuItems = restaurant?.menus?.filter(item => item.actif).length || 0;
  const activeLivreurs = restaurant?.livreurs?.filter(livreur => livreur.actif).length || 0;

  // Helper to calculate trend (current vs previous period)
  function calculateTrend<T>(
    current: T[],
    previous: T[],
    filterFn: (item: T) => boolean = () => true
  ) {
    const currentCount = current.filter(filterFn).length;
    const previousCount = previous.filter(filterFn).length;
    return currentCount - previousCount;
  }

  const getPreviousPeriodData = (items: any[], dateField: string) => {
    // Example: previous period = 7 days ago
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    return items.filter(
      (item) =>
        item[dateField] && new Date(item[dateField]) < oneWeekAgo
    );
  };

  const commandes = restaurant?.commandes || [];
  const menuItems = restaurant?.menus || [];
  const livreurs = restaurant?.livreurs || [];

  // For this example, assume each item has a createdAt or lastActive field
  const previousCommandes = getPreviousPeriodData(commandes, "crée_le");
  const previousMenuItems = getPreviousPeriodData(menuItems, "crée_le");
  const previousLivreurs = getPreviousPeriodData(livreurs, "active");

  // Trends
  const revenueTrend =
    commandes.reduce((sum, c) => sum + c.total, 0) -
    previousCommandes.reduce((sum, c) => sum + c.total, 0);

  const commandeTrend = calculateTrend(commandes, previousCommandes);
  const menuTrend = calculateTrend(
    menuItems,
    previousMenuItems,
    (item) => item.actif
  );
  const livreurTrend = calculateTrend(
    livreurs,
    previousLivreurs,
    (livreur) => livreur.actif
  );

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
          trend={revenueTrend}
        />

        <KPICard
          title="Total Commande"
          value={`${totalCommandes} Commande`}
          icon={<ShoppingBag size={18} className="text-[#F97316]" />}
          colorClass="text-[#F97316]"
          trend={commandeTrend}
        />

        <KPICard
          title="Active Menu Items"
          value={`${activeMenuItems} Items`}
          icon={<UtensilsCrossed size={18} className="text-[#3B82F6]" />}
          colorClass="text-[#3B82F6]"
          trend={menuTrend}
        />

        <KPICard
          title="Delivery Personnel"
          value={`${activeLivreurs} Livreurs`}
          icon={<Bike size={18} className="text-[#F59E0B]" />}
          colorClass="text-[#F59E0B]"
          trend={livreurTrend}
        />
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Recent Orders Table */}
      <RecentOrdersTable />
    </div>
  );
};

export default DashboardPage;
