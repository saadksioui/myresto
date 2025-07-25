"use client"
import { GeneralSettings, PaiementSettings, ProfilSettings } from "@/types/types";
import { Clock, CreditCard, Globe, Save, User } from "lucide-react";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>();
  const [profilSettings, setProfilSettings] = useState<ProfilSettings>();
  const [paiementSettings, setPaiementSettings] = useState<PaiementSettings>();

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


  const handleSaveSettings = () => {

  }




  const tabContent = {
    general: (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">General Settings</h3>

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
                value={generalSettings?.logo}
                onChange={handleGeneralSettingsChange}
              />
            </div>
            <div>
              <label htmlFor="banniére" className="block text-sm font-medium text-gray-700 mb-1">
                Banniére de restaurant
              </label>
              <input
                type="file"
                id="banniére"
                name="banniére"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={generalSettings?.banniére}
                onChange={handleGeneralSettingsChange}
              />
            </div>
            <div>
              <label htmlFor="minOrderAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount (Dhs)
              </label>
              <input
                type="number"
                id="minOrderAmount"
                name="minOrderAmount"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={generalSettings?.min_commande}
                onChange={handleGeneralSettingsChange}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="whatsappConfirmation"
                name="whatsappConfirmation"
                checked={generalSettings?.whatsapp_commande}
                onChange={handleGeneralSettingsChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="whatsappConfirmation" className="ml-2 block text-sm text-gray-700">
                Order Confirmation via WhatsApp
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600">Configure your restaurant preferences</p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 rounded-lg font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
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
