import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: number; // percentage
  colorClass: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, colorClass }) => {
  const isPositive = trend >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <div className={`p-2 rounded-full ${colorClass} bg-opacity-10`}>
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>

        <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {isPositive ? (
            <TrendingUp size={16} />
          ) : (
            <TrendingDown size={16} />
          )}
          <span>{Math.abs(trend)}%</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
