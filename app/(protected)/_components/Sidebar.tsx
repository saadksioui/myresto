"use client";
import { useState } from "react";
import { getRestaurants } from "../_actions/getRestaurant";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  X,
  Plus,
  ChefHat
} from 'lucide-react';
import Link from "next/link";

interface Restaurant {
  id: string;
  name: string;
  logo: string;
}

const Sidebar = async () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const restaurants: Restaurant[] = await getRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(restaurants[0]?.id);



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="w-[72px] bg-gray-900 flex-shrink-0 h-screen flex flex-col items-center py-4 gap-3">

        {restaurants.map((restaurant: Restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant.id)}
            className={`w-12 h-12 rounded-full overflow-hidden group relative transition-all duration-200 ${selectedRestaurant === restaurant.id
              ? 'rounded-[16px] bg-primary-500'
              : 'hover:rounded-[16px] hover:bg-primary-500'
              }`}
          >
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
              {restaurant.name}
            </div>
          </button>
        ))}

        {/* Add New Restaurant Button */}
        <button className="w-12 h-12 rounded-full bg-gray-800 hover:rounded-[16px] hover:bg-primary-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 group relative">
          <Plus size={24} />
          {/* Tooltip */}
          <div className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
            Add Restaurant
          </div>
        </button>
      </div>

      {/* Mobile sidebar toggle */}
      <button
        className="lg:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={20} /> : <MenuIcon size={20} />}
      </button>

      {/* Main Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-[72px] z-10 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-md lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Restaurant Info */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <img
              src={restaurants.find(r => r.id === selectedRestaurant)?.logo}
              alt={restaurants.find(r => r.id === selectedRestaurant)?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">
                {restaurants.find(r => r.id === selectedRestaurant)?.name}
              </h2>
              <p className="text-xs text-gray-500">Restaurant Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            href="/"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/menu"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <UtensilsCrossed size={20} />
            <span>Menu</span>
          </Link>

          <Link
            href="/orders"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Orders</span>
          </Link>

          <Link
            href="/livreurs"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <Bike size={20} />
            <span>Livreurs</span>
          </Link>

          <Link
            href="/settings"
            className="sidebar-link"
            onClick={() => setIsSidebarOpen(false)}
          >
            <SettingsIcon size={20} />
            <span>Settings</span>
          </Link>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[5] lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
};

export default Sidebar
