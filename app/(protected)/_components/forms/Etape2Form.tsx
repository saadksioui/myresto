"use client"
import { useEffect, useState } from "react";

const Etape2Form = ({ onSuccess }: { onSuccess: () => void }) => {
  const [restaurantID, setRestaurantID] = useState("");
  const [locationName, setLocationName] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState("MA (+212)");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await fetch("/api/restaurants"); // Get user's restaurants
      const data = await res.json();

      setRestaurantID(data.restaurant.id);
    };

    fetchRestaurant();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/restaurants/${restaurantID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        étape: 2,
        adresse: locationName,
        téléphone: whatsappNumber,
        whatsapp_commande: false
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erreur lors de l'enregistrement");
      return;
    }

    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Étape 2 sur 3</span>
        <span className="w-1/3 h-2 bg-red-500 rounded-full" style={{ width: "67%" }} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800">Étape 2 : Localisations et WhatsApp</h2>
      <input
        type="text"
        placeholder="Nom de l'emplacement"
        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        value={locationName}
        onChange={e => setLocationName(e.target.value)}
        required
      />
      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" fill="#555"/></svg>
            Localisation du restaurant
          </span>
        </label>

      </div>
      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          <span className="inline-flex items-center gap-2">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z" fill="#555"/></svg>
            Numéro WhatsApp
          </span>
        </label>
        <div className="flex gap-2">
          <select
            className="px-2 py-2 border rounded focus:outline-none"
            value={whatsappCountry}
            onChange={e => setWhatsappCountry(e.target.value)}
          >
            <option value="MA (+212)">MA (+212)</option>
            <option value="FR (+33)">FR (+33)</option>
            <option value="US (+1)">US (+1)</option>
          </select>
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            placeholder="612345678"
            value={whatsappNumber}
            onChange={e => setWhatsappNumber(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <button
          type="submit"
          className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Suivant"}
        </button>
      </div>
    </form>
  )
};

export default Etape2Form
