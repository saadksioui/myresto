import { Commande } from "@/types/modelsTypes";

const OrderCard = ({ order, onDragStart, onClick }: { order: Commande; onDragStart: (e: React.DragEvent, orderId: string) => void; onClick: () => void; }) => {
  return (
    <div>
      OrderCard
    </div>
  )
};

export default OrderCard
