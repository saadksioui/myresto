"use client"
import { Dialog } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Etape2Form from "../_components/forms/Etape2Form";
import Etape1Form from "../_components/forms/Etape1Form";
import Etape3Form from "../_components/forms/Etape3Form";

const Dashboard = () => {
  const [restaurantID, setRestaurantID] = useState(null as any);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const res = await fetch("/api/restaurants"); // Get user's restaurants
      const data = await res.json();
      if (data.restaurant.id) {
setStep(data.restaurant.étape_configuration);
      }
      

      setRestaurantID(data.restaurant.id);
    };

    fetchRestaurant();
  }, []);

  return (
    <>
      {step === 1 && (
        <Dialog>
          <Etape1Form
            onSuccess={() => setStep(2)}
          />
        </Dialog>
      )}
      {step === 2 && (
        <Dialog>
          <Etape2Form
            onSuccess={() => setStep(3)}
          />
        </Dialog>
      )}
      {step === 3 && (
        <Dialog>
          <Etape3Form
            onSuccess={() => setStep(4)} // Done!
          />
        </Dialog>
      )}

      {step >= 4 && (
        <div>
          {/* Your real dashboard UI here */}
          <h1>Bienvenue dans votre tableau de bord</h1>
        </div>
      )}
    </>
  )
};

export default Dashboard
