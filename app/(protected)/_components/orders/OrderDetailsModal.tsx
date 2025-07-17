import { Commande, Livreur } from "@/types/modelsTypes";
import { OrderStatus } from "@/types/types";
import { X, PhoneCall, Send } from 'lucide-react';

const OrderDetailsModal = ({
  order,
  onStatusChange,
  availableLivreurs,
  onAssignLivreur,
  onClose
}: {
  order: Commande;
  onClose: () => void;
  availableLivreurs: Livreur[];
  onStatusChange: (orderId: string, statut: OrderStatus) => void;
  onAssignLivreur: (orderId: string, livreurId: string) => void;
}) => {
  const statuses: OrderStatus[] = ["en_attente", "en_préparation", "assignée", "livrée", "annulée"];


  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(order.id, e.target.value as OrderStatus);
  };

  const handleLivreurAssign = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAssignLivreur(order.id, e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Order {order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h3>
                <div className="card">
                  <p className="font-medium">{order.client.nom}</p>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <PhoneCall size={14} className="mr-1" />
                    {order.client.téléphone}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {order.client.adresse}
                  </p>

                  <div className="flex items-center mt-4">
                    <a
                      href={`https://wa.me/${order.client.téléphone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 flex items-center text-sm hover:text-green-700"
                    >
                      <Send size={14} className="mr-1" />
                      WhatsApp Customer
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Management</h3>
                <div className="card space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={order.statut}
                      onChange={handleStatusChange}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status ? status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1) : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="livreur" className="block text-sm font-medium text-gray-700 mb-1">
                      Assign Livreur
                    </label>
                    <select
                      id="livreur"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={order.livreur?.id || ''}
                      onChange={handleLivreurAssign}
                    >
                      <option value="">-- Select Livreur --</option>
                      {availableLivreurs.map(livreur => (
                        <option key={livreur.id} value={livreur.id}>
                          {livreur.nom} ({livreur.téléphone})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">
                      Created: {formatDate(new Date(order.créé_le))}
                    </p>
                    <p className="text-sm text-gray-600">
                      Updated: {formatDate(new Date(order.modifié_le))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
              <div className="card">
                <ul className="divide-y divide-gray-100">
                  {order.détails.map(item => (
                    <li key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.menu.nom}</p>
                          <p className="text-sm text-gray-600">
                            {Number(item.prix_unitaire).toFixed(2)} Dhs × {item.quantité}
                          </p>
                        </div>
                        <p className="font-medium">
                          {(parseFloat(item.prix_unitaire) * item.quantité).toFixed(2)} Dhs
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total</p>
                    <p>{Number(order.total).toFixed(2)} Dhs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal
