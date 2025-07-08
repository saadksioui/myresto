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
        return "badge-warning";
      case "en_préparation":
        return "badge-neutral";
      case "assignée":
        return "badge-accent bg-accent-100 text-accent-800";
      case "livrée":
        return "badge-success";
      case "annulée":
        return "badge-error";
      default:
        return "badge-neutral";
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

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Commande</th>
              <th>Client</th>
              <th>Montant</th>
              <th>Statut</th>
              <th>Livreur</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.id}</td>
                <td>{order.client?.nom || "—"}</td>
                <td>
                  {parseFloat(order.total).toLocaleString()} Dhs
                </td>
                <td>
                  <span className={`badge ${getStatusColor(order.statut)}`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.statut)}
                      {order.statut}
                    </span>
                  </span>
                </td>
                <td>{order.livreur?.nom || "—"}</td>
                <td className="text-gray-500">{formatDate(order.créé_le)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
