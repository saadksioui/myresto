"use client";
import { useState } from "react";

const Step1 = ({
  onSuccess,
}: {
  onSuccess: (id: string) => void;
}) => {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/restaurants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nom,
        type,
        slug,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Erreur lors de l'enregistrement");
      return;
    }

    onSuccess(data.restaurant.id);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lgp-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Étape 1 : Configuration du restaurant
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Nom du restaurant <span className="text-red-500">*</span>
          </label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Nom du restaurant"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Type <span className="text-red-500">*</span>
          </label>
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type (ex: pizzeria, burger...)"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Slug <span className="text-gray-400">(facultatif)</span>
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="ex: mon-resto"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : "Suivant"}
        </button>
      </form>
    </div>
  );
};

export default Step1;
