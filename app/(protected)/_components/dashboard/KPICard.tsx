import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  trend: number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, colorClass, trend }) => {


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

        <div
          className={`flex items-center gap-1 ${
            trend > 0
              ? 'text-green-500'
              : trend < 0
              ? 'text-red-500'
              : 'text-gray-400'
          }`}
        >
          {trend > 0 ? (
            <TrendingUp size={16} />
          ) : trend < 0 ? (
            <TrendingDown size={16} />
          ) : (
            <TrendingUp size={16} className="rotate-90" /> // Neutral icon for 0%
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
