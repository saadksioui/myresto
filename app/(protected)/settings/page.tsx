"use client"
import { useRestaurant } from "@/context/RestaurantContext";
import { GeneralSettings, PaiementSettings, ProfilSettings } from "@/types/types";
import { Clock, CreditCard, Globe, LoaderCircle, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../loading";
import Image from "next/image";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>();
  const [profilSettings, setProfilSettings] = useState<ProfilSettings>();
  const [paiementSettings, setPaiementSettings] = useState<PaiementSettings>();
  const [previewLogoImage, setPreviewLogoImage] = useState<string | null>(null);
  const [previewBanniéreImage, setPreviewBanniéreImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoadingSettings(true);
      try {
        if (selectedRestaurant) {
          const response = await fetch(`/api/restaurants/${selectedRestaurant}/parametres`);
          const data = await response.json();
          setGeneralSettings({
            nom: data.paramètres.général?.nom,
            type: data.paramètres.général?.type,
            logo: data.paramètres.général?.logo_url,
            banniére: data.paramètres.général?.bannière_url,
            min_commande: data.paramètres.général?.min_commande,
            whatsapp_commande: data.paramètres.général?.whatsapp_commande,
          });
          setProfilSettings({
            nom_gérant: data.paramètres.profil?.nom_gérant,
            téléphone: data.paramètres.profil?.téléphone,
            email: data.paramètres.profil?.email,
            langue: data.paramètres.profil?.langue,
            facebook: data.paramètres.profil?.facebook,
            instagram: data.paramètres.profil?.instagram,
          });
          setPaiementSettings({
            livraison: data.paramètres.paiement?.livraison,
            frais_livraison: data.paramètres.paiement?.frais_livraison,
            min_commande: data.paramètres.paiement?.min_commande,
            espèce: data.paramètres.paiement?.espèce,
          });
          console.log(data);

          setIsLoadingSettings(false);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        setError("Failed to fetch settings");
        setIsLoadingSettings(false);
      }
    };

    fetchSettings();
  }, [selectedRestaurant]);

  const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGeneralSettings((prev) => prev ? { ...prev, logo: file } : prev);
    setPreviewLogoImage(file ? URL.createObjectURL(file) : null);
  };

  const handleBanniéreImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setGeneralSettings((prev) => prev ? { ...prev, banniére: file } : prev);
    setPreviewBanniéreImage(file ? URL.createObjectURL(file) : null);
  };


  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setGeneralSettings((prevSettings) => {
      if (!prevSettings) return prevSettings; // handle undefined case safely

      return {
        ...prevSettings,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
              ? parseFloat(value)
              : value,
      };
    });
  };

  const handleProfilSettingsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setProfilSettings((prevSettings) => {
      if (!prevSettings) return prevSettings;

      return {
        ...prevSettings,
        [name]:
          type === "number"
            ? parseFloat(value)
            : value,
      };
    });
  };



  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log(generalSettings);


    // Conversion seulement pour les nouveaux fichiers
    const getImageData = async (image: string | File | null) => {
      if (image instanceof File) {
        return await fileToBase64(image);
      }
      return image;
    };

    try {
      const logoImage = await getImageData(generalSettings?.logo || null);
      const bannerImage = await getImageData(generalSettings?.banniére || null); // Notez l'accent aigu

      const res = await fetch(`/api/restaurants/${selectedRestaurant}/parametres`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "général",
          nom: generalSettings?.nom,
          type: generalSettings?.type,
          logo: logoImage || generalSettings?.logo,
          banniére: bannerImage || generalSettings?.banniére, // Même accent aigu que le backend attend
          min_commande: generalSettings?.min_commande,
          whatsapp_commande: generalSettings?.whatsapp_commande,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneralSettings({
          nom: data.paramètres.général?.nom,
          type: data.paramètres.général?.type,
          logo: data.paramètres.général?.logo,
          banniére: data.paramètres.général?.banniére,
          min_commande: data.paramètres.général?.min_commande,
          whatsapp_commande: data.paramètres.général?.whatsapp_commande,
        });
      } else {
        setError("Failed to save general settings");
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {

      const res = await fetch(`/api/restaurants/${selectedRestaurant}/parametres`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "profil",
          nom_gérant: profilSettings?.nom_gérant,
          téléphone: profilSettings?.téléphone,
          email: profilSettings?.email,
          langue: profilSettings?.langue,
          facebook: profilSettings?.facebook,
          instagram: profilSettings?.instagram,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfilSettings({
          nom_gérant: data.paramètres.général?.nom_gérant,
          téléphone: data.paramètres.général?.téléphone,
          email: data.paramètres.général?.email,
          langue: data.paramètres.général?.langue,
          facebook: data.paramètres.général?.facebook,
          instagram: data.paramètres.général?.instagram,
        });
      } else {
        setError("Failed to save profile settings");
      }
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
    } finally {
      setIsLoading(false);
    }
  }




  const tabContent = {
    general: (
      <div className="space-y-6">
        <div className="w-full bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>

          <form onSubmit={handleSaveGeneralSettings}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de restaurant
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={generalSettings?.nom}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type de restaurant
                </label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={generalSettings?.type}
                  onChange={handleGeneralSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de restaurant
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleLogoImageChange}
                />
              </div>
              {(previewLogoImage || typeof generalSettings?.logo === 'string') && (
                <div className="mt-2">
                  <Image
                    src={(typeof previewLogoImage === 'string'
                      ? previewLogoImage
                      : typeof generalSettings?.logo === 'string'
                        ? generalSettings.logo
                        : '') as string}
                    alt="Preview"
                    className="h-[200px] rounded-md"
                    width={200}
                    height={200}
                  />
                </div>
              )}
              <div>
                <label htmlFor="banniére" className="block text-sm font-medium text-gray-700 mb-1">
                  Banniére de restaurant
                </label>
                <input
                  type="file"
                  id="banniére"
                  name="banniére"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleBanniéreImageChange}
                />
              </div>
              {(previewBanniéreImage || typeof generalSettings?.banniére === 'string') && (
                <div className="mt-2">
                  <Image
                    src={(typeof previewBanniéreImage === 'string'
                      ? previewBanniéreImage
                      : typeof generalSettings?.banniére === 'string'
                        ? generalSettings.banniére
                        : '') as string}
                    alt="Preview"
                    className="w-[200px] rounded-md"
                    width={200}
                    height={200}
                  />
                </div>
              )}
              <div>
                <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount (Dhs)
                </label>
                <input
                  type="number"
                  id="min_commande"
                  name="min_commande"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={generalSettings?.min_commande}
                  onChange={handleGeneralSettingsChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="whatsapp_commande"
                  name="whatsapp_commande"
                  checked={generalSettings?.whatsapp_commande}
                  onChange={handleGeneralSettingsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="whatsappConfirmation" className="ml-2 block text-sm text-gray-700">
                  Order Confirmation via WhatsApp
                </label>
              </div>
            </div>
            <div className="w-full flex justify-end mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white w-fit flex items-center justify-end gap-2"
              >
                {
                  isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={20} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save</span>
                    </>
                  )
                }
              </button>
            </div>
          </form>
        </div >
      </div >
    ),
    profile: (
      <div className="space-y-6">
        <div className="w-full bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Profil Information</h3>


          <form onSubmit={handleSaveProfileSettings}>
            <div className="space-y-4">
              <div>
                <label htmlFor="nom_gérant" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de gérant
                </label>
                <input
                  type="text"
                  id="nom_gérant"
                  name="nom_gérant"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilSettings?.nom_gérant ?? ''}
                  onChange={handleProfilSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="téléphone" className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone
                </label>
                <input
                  type="text"
                  id="téléphone"
                  name="téléphone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilSettings?.téléphone ?? ''}
                  onChange={handleProfilSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilSettings?.email ?? ''}
                  onChange={handleProfilSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="langue" className="block text-sm font-medium text-gray-700 mb-1">
                  Langue de contact
                </label>
                <select name="langue" id="langue" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={profilSettings?.langue ?? ''} onChange={handleProfilSettingsChange}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="text"
                  id="facebook"
                  name="facebook"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilSettings?.facebook ?? ''}
                  onChange={handleProfilSettingsChange}
                />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profilSettings?.instagram ?? ''}
                  onChange={handleProfilSettingsChange}
                />
              </div>
            </div>
            <div className="w-full flex justify-end mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white w-fit flex items-center justify-end gap-2"
              >
                {
                  isLoading ? (
                    <>
                      <LoaderCircle className="animate-spin" size={20} />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Save</span>
                    </>
                  )
                }
              </button>
            </div>
          </form>
        </div>

      </div>
    )
  }

  if (isLoadingSettings) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure your restaurant preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b overflow-x-auto">
          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'general'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('general')}
          >
            <Globe size={16} />
            General
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            Profile
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'paiement'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('paiement')}
          >
            <CreditCard size={16} />
            Paiement
          </button>

          <button
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'hours'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('hours')}
          >
            <Clock size={16} />
            Hours
          </button>
        </div>

        <div className="p-6">
          {tabContent[activeTab as keyof typeof tabContent]}
        </div>
      </div>
    </div>
  )
};

export default SettingsPage
