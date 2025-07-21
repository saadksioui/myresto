"use client"
import { useRestaurant } from "@/context/RestaurantContext";
import { Livreur } from "@/types/modelsTypes";
import { Bike, Pencil, Plus, Search, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import LivreurForm from "../_components/livreurs/LivreurForm";

const LivreursPage = () => {
  const [livreurs, setLivreurs] = useState<Livreur[]>();
  const [showForm, setShowForm] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState<Livreur | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const { selectedRestaurant } = useRestaurant();

  useEffect(() => {
    const fetchLivreur = async () => {
      if (!selectedRestaurant) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/restaurants/${selectedRestaurant}/livreurs`);
        const data = await res.json();
        setLivreurs(data.livreurs || []);
      } catch (err) {
        console.error("Failed to fetch livreurs data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLivreur();
  }, [selectedRestaurant]);

  const filteredLivreurs = useMemo(() => {
    if (!livreurs) return [];

    return livreurs.filter((livreur) => {
      const matchesSearch = livreur.nom.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && livreur.actif) ||
        (statusFilter === "Inactive" && !livreur.actif);

      return matchesSearch && matchesStatus;
    });
  }, [livreurs, searchQuery, statusFilter]);

  const handleEditLivreur = (id: string) => {
    const livreur = livreurs?.find(livreur => livreur.id === id);
    if (livreur) {
      setSelectedLivreur(livreur);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Livreurs</h1>
          <p className="text-gray-600">Manage your delivery personnel</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Livreur</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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

      {/* Livreurs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-white even:bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLivreurs.length > 0 ? (
                filteredLivreurs.map(livreur => (
                  <tr className="bg-white even:bg-gray-50" key={livreur.id}>
                    <td className="font-medium flex items-center gap-2 px-6 py-4 whitespace-nowrap text-sm">
                      <div className="bg-primary-100 p-1.5 rounded-full text-primary-600">
                        <Bike size={16} />
                      </div>
                      {livreur.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{livreur.téléphone}</td>
                    {/* <td>{livreur.vehicleType || '—'}</td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        livreur.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {livreur.actif ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                      {livreur.créé_le.slice(0, 10) || '—()'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEditLivreur(livreur.id)}
                          className="text-gray-600 hover:text-primary-600 transition-colors"
                          title="Edit livreur"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          /* onClick={() => handleDeleteLivreur(livreur.id)} */
                          className="text-gray-600 hover:text-error-500 transition-colors"
                          title="Delete livreur"
                        >
                          <Trash2 size={16} />
                        </button>

                        <button
                          /* onClick={() => handleToggleStatus(livreur.id)} */
                          className={`${
                            livreur.actif ? 'text-success-500' : 'text-gray-400'
                          } hover:text-primary-600 transition-colors`}
                          title={livreur.actif ? 'Set as inactive' : 'Set as active'}
                        >
                          {livreur.actif ? (
                            <ToggleRight color="green" size={18} />
                          ) : (
                            <ToggleLeft color="red" size={18} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white even:bg-gray-50">
                  <td colSpan={6} className="text-center text-gray-500 px-6 py-4 whitespace-nowrap text-sm">
                    No livreurs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Livreur Form Modal */}
      {showForm && selectedRestaurant && (
        <LivreurForm
          selectedRestaurant={selectedRestaurant}
          livreur={selectedLivreur}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
};

export default LivreursPage
