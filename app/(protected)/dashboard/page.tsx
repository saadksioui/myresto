"use client";
import { useRestaurant } from "@/context/RestaurantContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import DashboardPage from "./DashboardPage";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
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

          <DialogTitle asChild>
            <VisuallyHidden>Add New Restaurant</VisuallyHidden>
          </DialogTitle>
            <CreationProcessForRestaurant currentStepResto={restaurant.étape_configuration} restId={selectedRestaurant || undefined}/>
          </DialogContent>
        </Dialog>
      )}
      <DashboardPage />
    </>
  );
};

export default Dashboard;
