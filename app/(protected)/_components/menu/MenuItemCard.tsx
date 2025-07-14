import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Menu } from '@/types/modelsTypes';
import Image from 'next/image';

type DisplayMenu = Menu & {
  catégorieNom?: string;
};

interface MenuItemCardProps {
  item: DisplayMenu;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col">
        <div className="h-44 overflow-hidden rounded-md mb-4">
          <Image
            src={item.image_url ?? '/menu-placeholder.png'}
            alt={item.nom}
            className="w-full h-full object-cover"
            width={300}
            height={300}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{item.nom}</h3>
            <span className="text-lg font-bold text-accent-600">
              {item.prix} Dhs
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {item.catégorieNom}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.actif ? 'bg-green-100 text-green-800' : 'badge-errorbg-red-100 text-red-800'
            }`}>
              {item.actif ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(item.id)}
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                title="Edit item"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => onDelete(item.id)}
                className="p-2 text-gray-600 hover:text-error-500 transition-colors"
                title="Delete item"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <button
              onClick={() => onToggleStatus(item.id, !item.actif)}
              className={`p-2 ${
                item.actif ? 'text-success-500' : 'text-gray-400'
              } hover:text-primary-600 transition-colors`}
              title={item.actif ? 'Set as inactive' : 'Set as active'}
            >
              {item.actif ? (
                <ToggleRight size={22} />
              ) : (
                <ToggleLeft size={22} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;