"use client";
import { Commande } from "@/types/modelsTypes";
import { OrderStatus } from "@/types/types";
import { useEffect, useState } from "react";
import OrderCard from "../_components/orders/OrderCard";
import { useRestaurant } from "@/context/RestaurantContext";
import { CheckCircle2, Clock, Truck, UtensilsCrossed } from "lucide-react";
import OrderDetailsModal from "../_components/orders/OrderDetailsModal"; // Make sure this exists

const OrdersPage = () => {
  const [orders, setOrders] = useState<Commande[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/restaurants/${selectedRestaurant}/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: { orders: Commande[] } = await res.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [selectedRestaurant]);

  // Group orders by status (using correct enum values)
  const pendingOrders = orders.filter((o) => o.statut === "en_attente");
  const preparingOrders = orders.filter((o) => o.statut === "en_préparation");
  const outForDeliveryOrders = orders.filter((o) => o.statut === "assignée");
  const deliveredOrders = orders.filter((o) => o.statut === "livrée");
  const cancelledOrders = orders.filter((o) => o.statut === "annulée");

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const handleDragStart = (e: React.DragEvent, orderId: string) => {
    e.dataTransfer.setData("orderId", orderId);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData("orderId");
    handleStatusChange(orderId, targetStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleStatusChange = (orderId: string, statut: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, statut, updatedAt: new Date() } : order
      )
    );

    // Optionally sync to backend
    fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
  };

  const handleAssignLivreur = (orderId: string, livreurId: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            livreur_id: livreurId,
            updatedAt: new Date(),
          };
        }
        return order;
      })
    );
  };

  const renderColumn = (
    title: string,
    icon: React.ReactNode,
    columnOrders: Commande[],
    status: OrderStatus
  ) => (
    <div
      className="kanban-column w-72 bg-white rounded shadow p-4"
      onDrop={(e) => handleDrop(e, status)}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="font-medium">{title}</h3>
        <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
          {columnOrders.length}
        </span>
      </div>

      <div className="space-y-3">
        {columnOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onDragStart={handleDragStart}
            onClick={() => setSelectedOrderId(order.id)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-gray-600">Manage and track customer orders</p>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        {renderColumn("Pending", <Clock size={18} />, pendingOrders, "en_attente")}
        {renderColumn("Preparing", <UtensilsCrossed size={18} />, preparingOrders, "en_préparation")}
        {renderColumn("Out for Delivery", <Truck size={18} />, outForDeliveryOrders, "assignée")}
        {renderColumn("Delivered", <CheckCircle2 size={18} />, deliveredOrders, "livrée")}
        {renderColumn("Cancelled", <CheckCircle2 size={18} className="text-red-500" />, cancelledOrders, "annulée")}
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onStatusChange={handleStatusChange}
          onAssignLivreur={handleAssignLivreur}
        />
      )}
    </div>
  );
};

export default OrdersPage;
