"use client";

import Loading from "@/app/(protected)/loading";
import { createContext, useContext, useState, useEffect } from "react";

interface RestaurantContextType {
  selectedRestaurant: string | null;
  setSelectedRestaurant: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType>({
  selectedRestaurant: null,
  setSelectedRestaurant: () => {},
});

export const useRestaurant = () => useContext(RestaurantContext);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRestaurants() {
      try {
        const res = await fetch('/api/restaurants');
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data: { restaurants: { id: string }[] } = await res.json();

        if (data.restaurants.length > 0) {
          setSelectedRestaurant(data.restaurants[0].id);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRestaurants();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}
