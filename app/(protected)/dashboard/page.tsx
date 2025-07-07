"use client";
import { useRestaurant } from "@/context/RestaurantContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import CreationProcessForRestaurant from "../_components/CreationProcessForRestaurant";

type Restaurant = {
  étape_configuration: number;
  // add other properties as needed
};

const Dashboard = () => {
  const { selectedRestaurant } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!selectedRestaurant) return;
      const res = await fetch(`/api/restaurants/${selectedRestaurant}`);
      const data = await res.json();
      setRestaurant(data.restaurant);
      setLoading(false);
    };
    fetchRestaurant();
  }, [selectedRestaurant]);

  if (loading || !restaurant) return <div>Loading...</div>;

  return (
    <>
      {/* Show modal if step < 4 */}
      {restaurant.étape_configuration < 4 && (
        <Dialog open>
          <DialogContent>
            <CreationProcessForRestaurant currentStepResto={restaurant.étape_configuration} />
          </DialogContent>
        </Dialog>
      )}
      <DashboardPage />
    </>
  );
};

export default Dashboard;
