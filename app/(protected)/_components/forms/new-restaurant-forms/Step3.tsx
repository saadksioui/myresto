"use client";
import { useState, ChangeEvent, FormEvent } from "react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}


const Step3 = ({
  onSuccess,
  restaurantId,
}: {
  onSuccess: () => void;
  restaurantId: string;
}) => {
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [previewBanner, setPreviewBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogo(file);
    setPreviewLogo(file ? URL.createObjectURL(file) : null);
  };

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBanner(file);
    setPreviewBanner(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!logo || !banner) {
      setError("Veuillez ajouter un logo et une bannière.");
      setLoading(false);
      return;
    }

    try {
      // Convert files to base64
      const logoBase64 = await fileToBase64(logo);
      const bannerBase64 = await fileToBase64(banner);

      const res = await fetch(`/api/restaurants/${restaurantId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          étape: 3,
          logo_url: logoBase64,
          bannière_url: bannerBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'enregistrement");
        setLoading(false);
        return;
      }

      onSuccess();
    } catch (err) {
      setError("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl flex flex-col gap-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Étape 3 : Ajoutez le logo et la bannière de votre restaurant
      </h2>
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label className="block mb-2 font-medium text-gray-700">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="mb-2"
        />
        {previewLogo && (
          <img
            src={previewLogo}
            alt="Aperçu du logo"
            className="h-20 w-20 object-cover rounded border"
          />
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Bannière</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="mb-2"
        />
        {previewBanner && (
          <img
            src={previewBanner}
            alt="Aperçu de la bannière"
            className="h-24 w-full object-cover rounded border"
          />
        )}
      </div>

      <button
        type="submit"
        className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200"
        disabled={loading}
      >
        {loading ? "Enregistrement..." : "Enregistrer les images"}
      </button>
    </form>
    </div>
  )
};

export default Step3
