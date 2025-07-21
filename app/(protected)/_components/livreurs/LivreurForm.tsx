import { Livreur } from "@/types/modelsTypes";
import { Loader2, X } from "lucide-react";
import { useState } from "react";

interface LivreurFormProps {
  selectedRestaurant: string;
  livreur?: Livreur;
  onCancel: () => void;
}

const LivreurForm: React.FC<LivreurFormProps> = ({
  selectedRestaurant,
  livreur,
  onCancel
}) => {
  const [nom, setNom] = useState(livreur?.nom || "");
  const [telephone, setTelephone] = useState(livreur?.téléphone || "");
  const [email, setEmail] = useState(livreur?.email || "");
  const [actif, setActif] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurant}/livreurs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          téléphone: telephone,
          email,
          actif
        }),
      });


      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      onCancel();
    } catch (error) {
      console.log(error);
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/restaurants/${selectedRestaurant}/livreurs/${livreur?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom,
          téléphone: telephone,
          email,
          actif
        }),
      });


      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }
      onCancel();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {livreur ? 'Edit Livreur' : 'Add New Livreur'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={livreur ? handleUpdate : handleSave} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/*  <div>
              <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <select
                id="vehicleType"
                name="vehicleType"
                className="input"
                value={formData.vehicleType}
                onChange={handleChange}
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={actif}
                onChange={(e) => setActif(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white"
            >
              {
                loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  livreur ? 'Update Livreur' : 'Create Livreur'
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default LivreurForm
