"use client";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  X,
  Plus,
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";

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
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const res = await fetch("/api/restaurants");
      const data = await res.json();
      // Support both { restaurants: [...] } and [...] directly
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
    <div className="flex h-screen">
      {/* Small Sidebar */}
      <div className="w-[72px] bg-gray-900 flex-shrink-0 h-full flex flex-col items-center py-4 gap-3">
        <SidebarTrigger className="text-white" />
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

        <button
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-200 group relative hover:bg-blue-500 hover:text-white"
        >
          <Plus size={24} />
          <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Add Restaurant
          </div>
        </button>
      </div>

      {/* Expanded Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <Image
                src={restaurants.find((r) => r.id === selectedRestaurant)?.logo_url || "/placeholder.png"}
                alt={restaurants.find((r) => r.id === selectedRestaurant)?.nom || "Restaurant logo"}
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
        </SidebarHeader>
        <SidebarContent>
          <nav className="p-4 space-y-1">
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive("/")
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/menu"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive("/menu")
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <UtensilsCrossed size={20} />
              <span>Menu</span>
            </Link>

            <Link
              href="/orders"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive("/orders")
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <ShoppingBag size={20} />
              <span>Orders</span>
            </Link>

            <Link
              href="/livreurs"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive("/livreurs")
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Bike size={20} />
              <span>Livreurs</span>
            </Link>

            <Link
              href="/settings"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive("/settings")
                ? "bg-red-100 text-red-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <SettingsIcon size={20} />
              <span>Settings</span>
            </Link>
          </nav>
        </SidebarContent>
        <SidebarFooter className="w-full flex flex-col items-center justify-center mb-10">
          {qrCode && (
            <Image
              src={qrCode}
              alt="QR Code"
              width={100}
              height={100}
            />
          )}
          {menuUrl && (
            <Link
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm flex items-center gap-2 px-3 py-2 mt-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <span>Voir le menu</span>
            </Link>
          )}
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
