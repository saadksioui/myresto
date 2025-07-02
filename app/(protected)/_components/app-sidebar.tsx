"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Settings as SettingsIcon,
  Plus,
  Menu as MenuIcon,
  Sidebar,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CreationProcessForRestaurant from "./CreationProcessForRestaurant";

interface Restaurant {
  id: string;
  nom: string;
  logo_url: string;
}

const AppSidebar = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [menuUrl, setMenuUrl] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      const list = Array.isArray(data.restaurants)
        ? data.restaurants
        : Array.isArray(data)
          ? data
          : [];
      setRestaurants(list);
      setSelectedRestaurant(list[0]?.id || null);
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchQRCode = async () => {
      if (!selectedRestaurant) return;
      const res = await fetch(`/api/restaurants/${selectedRestaurant}/qrcode`);
      const data = await res.json();
      setQrCode(data.qrCode);
      setMenuUrl(data.menuUrl);
    };

    fetchQRCode();
  }, [selectedRestaurant]);

  return (
    <>
      <Dialog open={showCreationModal} onOpenChange={setShowCreationModal}>
        <DialogContent className="max-w-2xl p-0">
          <CreationProcessForRestaurant />
        </DialogContent>
      </Dialog>
      {/* Small Sidebar */}
      <div className="w-20 bg-gray-900 flex flex-col items-center py-4 gap-3 z-20">
        <button
          className="text-white p-2 rounded-md hover:bg-gray-800"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Sidebar size={20} />
        </button>

        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant.id)}
            className={`w-12 h-12 rounded-full overflow-hidden group relative transition-all duration-200 ${selectedRestaurant === restaurant.id
              ? "rounded-[16px] bg-blue-500"
              : "hover:rounded-[16px] hover:bg-blue-500"
              }`}
          >
            <img
              src={restaurant.logo_url}
              alt={restaurant.nom}
              className="w-full h-full object-cover"
            />
            <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {restaurant.nom}
            </div>
          </button>
        ))}

        <button className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-200 group relative hover:bg-blue-500 hover:text-white"
          onClick={() => setShowCreationModal(true)}
        >
          <Plus size={24} />
          <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Add Restaurant
          </div>
        </button>
      </div>

      {/* Expanded Sidebar */}
      <div
        className={`w-64 h-full bg-white shadow-md flex flex-col z-10 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 hidden"
          }`}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src={
                restaurants.find((r) => r.id === selectedRestaurant)?.logo_url ||
                "/placeholder.png"
              }
              alt={
                restaurants.find((r) => r.id === selectedRestaurant)?.nom ||
                "Restaurant logo"
              }
              className="w-10 h-10 rounded-full object-cover"
              width={40}
              height={40}
            />
            <div>
              <h2 className="text-lg font-semibold">
                {restaurants.find((r) => r.id === selectedRestaurant)?.nom}
              </h2>
              <p className="text-xs text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-1 flex-1 overflow-auto">
          {[
            { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { href: "/menu", icon: UtensilsCrossed, label: "Menu" },
            { href: "/orders", icon: ShoppingBag, label: "Orders" },
            { href: "/livreurs", icon: Bike, label: "Livreurs" },
            { href: "/settings", icon: SettingsIcon, label: "Settings" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive(item.href)
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="w-full flex flex-col items-center justify-center mb-6">
          {qrCode && (
            <Image src={qrCode} alt="QR Code" width={100} height={100} />
          )}
          {menuUrl && (
            <Link
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-2 px-3 py-2 mt-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Voir le menu
            </Link>
          )}
        </div>
      </div>
    </>
  );

};

export default AppSidebar;
