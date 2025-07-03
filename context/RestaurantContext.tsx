"use client"
import { createContext, useContext, useState } from "react";

const RestaurantContext = createContext<{
  selectedRestaurant: string | null;
  setSelectedRestaurant: (id: string) => void;
}>({
  selectedRestaurant: null,
  setSelectedRestaurant: () => {},
});

export const useRestaurant = () => useContext(RestaurantContext);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  return (
    <RestaurantContext.Provider value={{ selectedRestaurant, setSelectedRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}