"use client";

import { useState } from "react";

const Step2 = ({
  onSuccess,
  restaurantId,
}: {
  onSuccess: () => void;
  restaurantId: string;
}) => {
  const [address, setAddress] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState("MA (+212)");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          étape: 2,
          adresse: address,
          téléphone: whatsappNumber,
          whatsapp_commande: false,
        }),
      });

      let data = null;
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.warn("Invalid or empty JSON response");
      }

      if (!res.ok) {
        setError(data?.message || "Erreur lors de l'enregistrement");
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Network or server error:", err);
      setError("Erreur inattendue, veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Localisation & WhatsApp
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Adresse du restaurant <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Tapez votre adresse"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={address}
            onChange={e => setAddress(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            <span className="inline-flex items-center gap-2">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1v3.5a1 1 0 01-1 1C10.07 22 2 13.93 2 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.26 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"
                  fill="#3B82F6"
                />
              </svg>
              Numéro WhatsApp <span className="text-red-500">*</span>
            </span>
          </label>
          <div className="flex gap-2">
            <select
              className="px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={whatsappCountry}
              onChange={e => setWhatsappCountry(e.target.value)}
            >
              <option value="MA (+212)">MA (+212)</option>
              <option value="FR (+33)">FR (+33)</option>
              <option value="US (+1)">US (+1)</option>
            </select>
            <input
              type="text"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="0612345678"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              required
            />
          </div>
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Chargement..." : "Suivant"}
        </button>
      </form>
    </div>
  );
};

export default Step2;
