
import {
  Clock,
  QrCode,
  Calendar
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Clock size={24} />,
      title: 'Gestion du menu',
      description: 'Mettez à jour votre menu, vos prix et votre disponibilité en temps réel.'
    },
    {
      icon: <QrCode size={24} />,
      title: 'Réception directe',
      description: 'Recevez vos commandes directement sur KiliMa et gérez vos commandes sans intermédiaire.'
    },
    {
      icon: <Calendar size={24} />,
      title: 'Contrôle des prix',
      description: 'Gardez le contrôle total de vos prix sans interférence ni surcoûts.'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Des outils puissants pour gérer vos commandes en ligne</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;