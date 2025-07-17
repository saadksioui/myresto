import { Commande } from "@/types/modelsTypes";
import { User, Phone, MapPin } from 'lucide-react';

interface OrderCardProps {
  order: Commande;
  onDragStart: (e: React.DragEvent, orderId: string) => void;
  onClick: (orderId: string) => void;
}

const OrderCard = ({ order, onDragStart, onClick }: OrderCardProps) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div
      className="bg-white rounded-lg p-4 mb-3 shadow-sm cursor-pointer group"
      draggable
      onDragStart={(e) => onDragStart(e, order.id)}
      onClick={() => onClick(order.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium group-hover:text-primary-600">
          {order.id}
        </h4>
        <span className="text-sm text-gray-500">
          {formatTime(new Date(order.créé_le))}
        </span>
      </div>

      <div className="mb-2">
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <User size={14} className="mr-1" />
          <span className="truncate">{order.client.nom}</span>
        </div>

        <div className="flex items-center text-sm text-gray-700 mb-1">
          <Phone size={14} className="mr-1" />
          <span className="truncate">{order.client.téléphone}</span>
        </div>

        <div className="flex items-start text-sm text-gray-700">
          <MapPin size={14} className="mr-1 mt-1 flex-shrink-0" />
          <span className="truncate line-clamp-1">{order.client.adresse}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {order.détails.length} items
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <span className="text-sm font-semibold">
          {Number(order.total).toFixed(2)} Dhs
        </span>

        {order.livreur?.nom ? (
          <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded-full">
            {order.livreur.nom}
          </span>
        ) : order.statut === 'Pending' ? (
          <span className="text-xs px-2 py-1 bg-warning-100 text-warning-800 rounded-full">
            Unassigned
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default OrderCard;
