import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, colorClass }) => {

  return (
    <div className="rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default KPICard;
