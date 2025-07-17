import { Commande } from "@/types/modelsTypes";
import { OrderStatus } from "@/types/types";

const OrderDetailsModal = ({
  order,
  onStatusChange,
  onAssignLivreur,
  onClose
}: {
  order: Commande;
  onClose: () => void;
  onStatusChange: (orderId: string, statut: OrderStatus) => void;
  onAssignLivreur: (orderId: string, livreurId: string) => void;
}) => {
  return (
    <div>
      OrderDetailsModal
    </div>
  )
};

export default OrderDetailsModal
