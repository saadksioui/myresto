"use client";

import Loading from "@/app/(protected)/loading";
import { Restaurant } from "@/types/modelsTypes";
import { createContext, useContext, useState, useEffect } from "react";

interface RestaurantContextType {
  selectedRestaurant: string | null;
  lieu_id: string | null;
  setSelectedRestaurant: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType>({
  selectedRestaurant: null,
  lieu_id: null,
  setSelectedRestaurant: () => { },
});

export const useRestaurant = () => useContext(RestaurantContext);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const [lieuId, setLieuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRestaurants() {
      try {
        const res = await fetch('/api/restaurants');
        if (!res.ok) throw new Error("Failed to fetch restaurants");
        const data: { restaurants: Restaurant[] } = await res.json();

        if (data.restaurants.length > 0) {
          setSelectedRestaurant(data.restaurants[0].id);
          if (data.restaurants[0].lieux?.length > 0) {
            setLieuId(data.restaurants[0].lieux[0].id);  // id du lieu, pas lieu_id
          }
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
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant, lieu_id: lieuId }}>
      {children}
    </RestaurantContext.Provider>
  );
}
