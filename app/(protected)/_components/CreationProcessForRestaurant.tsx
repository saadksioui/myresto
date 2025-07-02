"use client";
import { useState } from "react";
import Etape1Form from "./forms/Etape1Form";
import Etape2Form from "./forms/Etape2Form";
import Etape3Form from "./forms/Etape3Form";
import { useRouter } from "next/navigation";

const steps = [
  { label: "Informations", component: Etape1Form },
  { label: "Localisation & WhatsApp", component: Etape2Form },
  { label: "Logo & Bannière", component: Etape3Form },
];

const CreationProcessForRestaurant = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const router = useRouter();

  // Called after Etape1Form success, expects restaurantId from API
  const handleEtape1Success = (id: string) => {
    setRestaurantId(id);
    setCurrentStep(1);
  };

  // Called after Etape2Form success
  const handleEtape2Success = () => setCurrentStep(2);

  // Called after Etape3Form success
  const handleEtape3Success = () => setCurrentStep(3);

  // Progress bar width
  const progress = ((currentStep) / (steps.length - 1)) * 100;

  // Redirect after success
  if (currentStep === 3 && restaurantId) {
    setTimeout(() => {
      router.push(`/dashboard?restaurant=${restaurantId}`);
    }, 1500);
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <div key={step.label} className="flex-1 text-center text-xs font-semibold"
              style={{ color: currentStep >= idx ? "#ef4444" : "#9ca3af" }}>
              {step.label}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-red-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Forms */}
      {/* {currentStep === 0 && (
        <Etape1Form
          onSuccess={handleEtape1Success}
        />
      )}
      {currentStep === 1 && restaurantId && (
        <Etape2Form
          onSuccess={handleEtape2Success}
          restaurantId={restaurantId}
        />
      )}
      {currentStep === 2 && restaurantId && (
        <Etape3Form
          onSuccess={handleEtape3Success}
          restaurantId={restaurantId}
        />
      )} */}
      {currentStep === 3 && (
        <div className="text-center py-12">
          <div className="text-2xl font-bold text-green-600 mb-2">Restaurant créé avec succès !</div>
          <div className="text-gray-600">Vous pouvez maintenant accéder à votre dashboard.</div>
        </div>
      )}
    </div>
  );
};

export default CreationProcessForRestaurant;
