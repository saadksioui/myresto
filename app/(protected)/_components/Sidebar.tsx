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

interface Restaurant {
  id: string;
  nom: string;
  logo_url: string;
}

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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


  return (
    <>
      {/* Small Sidebar */}
      <div className="w-[72px] bg-gray-900 flex-shrink-0 h-screen flex flex-col items-center py-4 gap-3">
        {restaurants.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant.id)}
            className={`w-12 h-12 rounded-full overflow-hidden group relative transition-all duration-200 ${selectedRestaurant === restaurant.id
                ? "rounded-[16px]"
                : "hover:rounded-[16px]"
              }`}
            style={{
              backgroundColor:
                selectedRestaurant === restaurant.id ? "#3B82F6" : "transparent",
            }}
            onMouseEnter={e => {
              if (selectedRestaurant !== restaurant.id)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3B82F6";
            }}
            onMouseLeave={e => {
              if (selectedRestaurant !== restaurant.id)
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
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
          className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 transition-all duration-200 group relative"
          style={{ transitionProperty: "background-color" }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#3B82F6";
            (e.currentTarget.querySelector("svg") as SVGElement).style.color = "white";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#27272a"; // gray-800 hex
            (e.currentTarget.querySelector("svg") as SVGElement).style.color = "#9CA3AF"; // text-gray-400 hex
          }}
        >
          <Plus size={24} />
          <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Add Restaurant
          </div>
        </button>
      </div>

      {/* Toggle Button */}
      <button
        className="lg:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Expanded Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-[72px] z-10 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-md lg:translate-x-0 ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
          }`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={restaurants.find((r) => r.id === selectedRestaurant)?.logo_url}
              alt={restaurants.find((r) => r.id === selectedRestaurant)?.nom}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {restaurants.find((r) => r.id === selectedRestaurant)?.nom}
              </h2>
              <p className="text-xs text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/"
            className={`sidebar-link ${isActive("/") ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/menu"
            className={`sidebar-link ${isActive("/menu") ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <UtensilsCrossed size={20} />
            <span>Menu</span>
          </Link>

          <Link
            href="/orders"
            className={`sidebar-link ${isActive("/orders") ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>

          <Link
            href="/livreurs"
            className={`sidebar-link ${isActive("/livreurs") ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Bike size={20} />
            <span>Livreurs</span>
          </Link>

          <Link
            href="/settings"
            className={`sidebar-link ${isActive("/settings") ? "active" : ""}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[5] lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
