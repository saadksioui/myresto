"use client"
import { Catégorie, Menu } from "@/types/modelsTypes";
import { LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MenuItemUpdateForm = ({ item, onCancel }: { item: Menu, onCancel: () => void }) => {
  const [categories, setCategories] = useState<Catégorie[]>([]);
  const [nom, setNom] = useState(item.nom);
  const [description, setDescription] = useState(item.description);
  const [prix, setPrix] = useState<number>(Number(item.prix));
  const [catégorieId, setCatégorieId] = useState(item.catégorie_id);
  const [actif, setActif] = useState(item.actif);
  const [menuImage, setMenuImage] = useState<File | null>(item.image_url ? null : null);
  const [previewMenuImage, setPreviewMenuImage] = useState<string | null>(item.image_url ?? null);
  const [options, setOptions] = useState<{ nom: string; prix_supplément: number }[]>(
    (item.options ?? []).map(opt => ({
      nom: opt.nom,
      prix_supplément: Number(opt.prix_supplément),
    }))
  );
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMenuImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMenuImage(file);
    setPreviewMenuImage(file ? URL.createObjectURL(file) : null);
  };

  const addOption = () => {
    setOptions([...options, { nom: "", prix_supplément: 0 }]);
  };

  const updateOption = (index: number, field: "nom" | "prix_supplément", value: string | number) => {
    const updated = [...options];
    if (field === "prix_supplément") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setOptions(updated);
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };


  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch(`/api/restaurants/${item.restaurant_id}/menu`);
      const data = await res.json();
      setCategories(data.catégories);
    }

    fetchCategory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const base64Image = menuImage ? await fileToBase64(menuImage) : null;
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/restaurants/${item.restaurant_id}/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "menu",
          nom,
          description,
          prix,
          catégorie_id: catégorieId,
          image_url: base64Image ?? item.image_url,
          actif: item.actif,
          options,
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            Update Item
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm p-4">{error}</p>}

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name*
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="prix" className="block text-sm font-medium text-gray-700 mb-1">
                Prix (Dhs)*
              </label>
              <input
                type="number"
                id="prix"
                name="prix"
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={prix}
                onChange={(e) => setPrix(parseFloat(e.target.value))}
              />
            </div>

            <div>
              <label htmlFor="catégorie" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie*
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
                <select
                  id="catégorie"
                  name="catégorie"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={catégorieId || ""}
                  onChange={(e) => setCatégorieId(e.target.value)}
                >
                  <option value="" disabled>Select category</option>
                  {categories?.map((catégorie) => (
                    <option key={catégorie.id} value={catégorie.id}>
                      {catégorie.nom}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAddCategory(true)}
                  className="sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center justify-center gap-1"
                >
                  <span>Ajouter une nouvelle catégorie</span>
                </button>
              </div>

            </div>

            <div>
              <label htmlFor="menuImage" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL*
              </label>
              <input
                type="file"
                id="menuImage"
                name="menuImage"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleMenuImageChange}
              />
              {previewMenuImage && (
                <div className="mt-2">
                  <Image
                    src={previewMenuImage}
                    alt="Preview"
                    className="w-full h-auto rounded-md"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Options</label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Option Name"
                    value={option.nom}
                    onChange={(e) => updateOption(index, "nom", e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Supplement Price"
                    value={option.prix_supplément}
                    onChange={(e) => updateOption(index, "prix_supplément", e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Remove option"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="mt-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
              >
                Add Option
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="actif"
                name="actif"
                checked={actif}
                onChange={(e) => setActif(e.target.checked)}
              />
              <label htmlFor="actif" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              {
                loading ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  "Modifier"
                )
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default MenuItemUpdateForm
