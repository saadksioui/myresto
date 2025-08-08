import React from 'react';
import { Check } from 'lucide-react';

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isHighlighted?: boolean;
}

const PricingTier = ({
  title,
  price,
  description,
  features,
  isHighlighted = false
}: PricingTierProps) => {
  return (
    <div
      className={`rounded-xl p-8 border transition-all duration-300 ${
        isHighlighted
          ? 'border-blue-500 bg-white shadow-card transform hover:-translate-y-1'
          : 'border-gray-200 bg-white hover:-translate-y-1'
      }`}
    >
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-4xl font-extrabold text-gray-900">{price}</span>
          <span className="text-gray-600 ml-1">/mois</span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check size={18} className="text-blue-500 flex-shrink-0 mr-2 mt-1" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          isHighlighted
            ? 'bg-blue-500 hover:bg-blue-500/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300'
            : 'bg-white hover:bg-gray-50 text-blue-500 border border-blue-500'
        }`}
      >
        Commencer
      </button>
    </div>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Choisissez votre plan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Options de tarification flexibles pour les restaurants de toutes tailles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PricingTier
            title="Gratuit"
            price="0"
            description="Pour démarrer"
            features={[
              "Gestion de menu",
              "Commandes illimitées",
              "Support email"
            ]}
          />

          <PricingTier
            title="Standard"
            price="200"
            description="Pour les restaurants établis"
            features={[
              "Toutes les fonctionnalités gratuites",
              "Personnalisation",
              "Gestion des commandes",
              "Base de données clients",
              "Support prioritaire"
            ]}
            isHighlighted={true}
          />

        </div>
      </div>
    </section>
  );
};

export default PricingSection;