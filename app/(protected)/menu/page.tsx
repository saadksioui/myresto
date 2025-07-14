"use client";
import { Catégorie, Menu } from "@/types/modelsTypes";
import { useRestaurant } from "@/context/RestaurantContext";
import { useEffect, useState } from "react";
import MenuItemForm from "../_components/menu/forms/MenuItemAddForm";
import MenuItemCard from "../_components/menu/MenuItemCard";
import { Filter, Plus, Search } from "lucide-react";

const MenuPage = () => {
  const { selectedRestaurant } = useRestaurant();
  const [categorieItems, setCategorieItems] = useState<Catégorie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Fetch categories with menus
  useEffect(() => {
    const fetchMenus = async () => {
      if (!selectedRestaurant) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${selectedRestaurant}/menu`);
        const data = await res.json();
        setCategorieItems(data.catégories || []);
      } catch (err) {
        console.error("Failed to fetch menu data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [selectedRestaurant]);

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  const handleEditItem = (id: string) => {
    setShowUpdateForm(true);
    // Add logic to load the selected item if needed
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setCategorieItems((prev) =>
        prev.map((cat) => ({
          ...cat,
          menus: cat.menus.filter((menu) => menu.id !== id),
        }))
      );
    }
  };

  const handleToggleStatus = (id: string, status: boolean) => {
    setCategorieItems((prev) =>
      prev.map((cat) => ({
        ...cat,
        menus: cat.menus.map((menu) =>
          menu.id === id ? { ...menu, actif: status } : menu
        ),
      }))
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const categoryOptions = ["All", ...categorieItems.map((c) => c.nom)];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Menu Management</h1>
          <p className="text-gray-600">Add, edit, and manage your menu items</p>
        </div>

        <button
          onClick={handleAddItem}
          className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categoryOptions.map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-400">Loading menu items...</p>
        </div>
      ) : categorieItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categorieItems.flatMap((cat) =>
            cat.menus.map((menu) => (
              <MenuItemCard
                key={menu.id}
                item={{ ...menu, catégorieNom: cat.nom }} // optional: use `catégorieNom` for display only
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onToggleStatus={handleToggleStatus}
              />
            ))
          )}

        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No menu items found matching your criteria.</p>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddForm && selectedRestaurant && (
        <MenuItemForm
          restaurantId={selectedRestaurant}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default MenuPage;
