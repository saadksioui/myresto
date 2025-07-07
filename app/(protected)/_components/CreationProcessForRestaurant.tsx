"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1 from "./forms/new-restaurant-forms/Step1";
import Step2 from "./forms/new-restaurant-forms/Step2";
import Step3 from "./forms/new-restaurant-forms/Step3";

const steps = [
  { label: "Informations", component: Step1 },
  { label: "Localisation & WhatsApp", component: Step2 },
  { label: "Logo & Bannière", component: Step3 },
];

const CreationProcessForRestaurant = ({
  currentStepResto = 0,
  restId,
}: { currentStepResto?: number; restId?: string }) => {
  const [currentStep, setCurrentStep] = useState(currentStepResto || 0);
  const [restaurantId, setRestaurantId] = useState<string | null>(restId || null);
  const router = useRouter();

  // Called after Step1 success, expects restaurantId from API
  const handleEtape1Success = (id: string) => {
    setRestaurantId(id);
    setCurrentStep(1);
  };

  // Called after Step2 success
  const handleEtape2Success = () => setCurrentStep(2);

  // Called after Step3 success
  const handleEtape3Success = () => setCurrentStep(3);

  // Progress bar width
  const progress = currentStep < 4 && ((currentStep) / (steps.length - 1)) * 100;

  // Redirect after success
  if (currentStep === 3 && restaurantId) {
    setTimeout(() => {
      router.push(`/dashboard`);
    }, 1500);
  }

  return (
    <div className="w-full mx-auto bg-white rounded p-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className="flex-1 text-center text-xs font-semibold"
              style={{ color: currentStep >= idx ? "#3B82F6" : "#9ca3af" }}
            >
              {step.label}
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: "#3B82F6" }}
          />
        </div>
      </div>

      {/* Step Forms */}
      {currentStep === 0 && (
        <Step1
          onSuccess={handleEtape1Success}
        />
      )}
      {currentStep === 1 && restaurantId && (
        <Step2
          onSuccess={handleEtape2Success}
          restaurantId={restaurantId}
        />
      )}
      {currentStep === 2 && restaurantId && (
        <Step3
          onSuccess={handleEtape3Success}
          restaurantId={restaurantId}
        />
      )}
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
