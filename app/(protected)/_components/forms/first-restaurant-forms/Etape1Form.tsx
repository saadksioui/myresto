"use client"
import { useState } from "react";

const Etape1Form = ({ onSuccess, restaurantId }: { onSuccess: () => void, restaurantId: string }) => {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/restaurants/${restaurantId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        étape: 1,
        nom,
        type,
        slug,
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
    <form onSubmit={handleSubmit}>
      <h2>Étape 1: Configuration du restaurant</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du restaurant" required />
      <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type (e.g. pizzeria)" required />
      <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (facultatif)" />
      <button type="submit">Suivant</button>
    </form>
  )
};

export default Etape1Form
