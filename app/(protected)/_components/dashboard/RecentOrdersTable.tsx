import { useRestaurant } from "@/context/RestaurantContext";
import { Commande, Restaurant } from "@/types/modelsTypes";
import { CheckCircle2, Clock, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const RecentOrdersTable = () => {
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

  const orders: Commande[] = restaurant?.commandes || [];

  const recentOrders = orders
    .slice()
    .sort((a, b) => new Date(b.créé_le).getTime() - new Date(a.créé_le).getTime())
    .slice(0, 10);

  // Map backend status to UI status and color
  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return <Clock size={16} className="text-yellow-500" />;
      case "en_préparation":
        return <ShoppingBag size={16} className="text-blue-500" />;
      case "assignée":
        return <Truck size={16} className="text-purple-500" />;
      case "livrée":
        return <CheckCircle2 size={16} className="text-green-500" />;
      case "annulée":
        return <Clock size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-800";
      case "en_préparation":
        return "bg-gray-100 text-gray-800";
      case "assignée":
        return "bg-[#FFEDD5] text-[#9A3412]";
      case "livrée":
        return "bg-green-100 text-green-800";
      case "annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Dernières commandes</h3>
        <Link href={"/orders"}>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            Voir tout
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-white even:bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Livreur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr className="bg-white even:bg-gray-50" key={order.id}>
                <td className="font-medium px-6 py-4 whitespace-nowrap text-sm">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.client?.nom || "—"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {parseFloat(order.total).toLocaleString()} Dhs
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.statut)}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.statut)}
                      {order.statut.replace(/_/g, ' ').charAt(0).toUpperCase() + order.statut.replace(/_/g, ' ').slice(1)}
                    </span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{order.livreur?.nom || "—"}</td>
                <td className="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.créé_le)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
