"use client"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Etape1Form from "../_components/forms/first-restaurant-forms/Etape1Form";
import Etape2Form from "../_components/forms/first-restaurant-forms/Etape2Form";
import Etape3Form from "../_components/forms/first-restaurant-forms/Etape3Form";
import DashboardPage from "./DashboardPage";

type Restaurant = {
  id: string;
  étape_configuration: number;
  // add other properties if needed
};

const Dashboard = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch("/api/restaurants");

        if (!res.ok) {
          throw new Error("Failed to fetch restaurant");
        }

        const data = await res.json();

        if (data.restaurants && data.restaurants.length > 0) {
          setRestaurant(data.restaurants[0]);
          setStep(data.restaurants[0].étape_configuration ?? 1);
        } else {
          console.warn("Aucun restaurant trouvé");
          setStep(1); // or fallback logic
        }
      } catch (error) {
        console.error("Erreur lors du chargement du restaurant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, []);

  return (
    <>
      {!loading && restaurant && step === 1 && (
        <Dialog open>
          <DialogContent>
            <Etape1Form
              restaurantId={restaurant.id}
              onSuccess={() => setStep(2)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!loading && restaurant && step === 2 && (
        <Dialog open>
          <DialogContent>
            <Etape2Form
              restaurantId={restaurant.id}
              onSuccess={() => setStep(3)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!loading && restaurant && step === 3 && (
        <Dialog open>
          <DialogContent>
            <Etape3Form
              restaurantId={restaurant.id}
              onSuccess={() => setStep(4)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!loading && step >= 4 && (
        <div>
          <DashboardPage />
        </div>
      )}
    </>
  );
};

export default Dashboard