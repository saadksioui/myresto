"use client"

import { useRestaurant } from "@/context/RestaurantContext";
import { Restaurant, Commande } from "@/types/modelsTypes";
import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";

// Dynamically import Chart with SSR disabled
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type TimeRange = 'day' | 'week' | 'month';

const RevenueChart = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const { selectedRestaurant } = useRestaurant();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!selectedRestaurant) return;
      const res = await fetch(`/api/restaurants/${selectedRestaurant}`);
      const data = await res.json();
      setRestaurant(data.restaurant);
    };
    fetchRestaurant();
  }, [selectedRestaurant]);

  // Helper to group and sum revenue by date
  function groupRevenueBy(items: Commande[], keyFn: (date: Date) => string) {
    const map = new Map<string, number>();
    items.forEach((commande) => {
      // Use créé_le as the date field and parse total as number
      if (!commande.créé_le || !commande.total) return;
      const date = new Date(commande.créé_le);
      const key = keyFn(date);
      const total = typeof commande.total === "string" ? parseFloat(commande.total) : commande.total;
      map.set(key, (map.get(key) || 0) + total);
    });
    // Return sorted array of { x, y }
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([x, y]) => ({ x, y }));
  }

  // Prepare data from selected restaurant
  const commandes: Commande[] = restaurant?.commandes || [];

  // Daily revenue for the last 7 days
  const dailyRevenueData = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      return d.toISOString().slice(0, 10);
    });
    const grouped = groupRevenueBy(commandes, (date) => date.toISOString().slice(0, 10));
    // Fill missing days with 0
    return days.map((day) => ({
      x: day,
      y: grouped.find((g) => g.x === day)?.y || 0,
    }));
  }, [commandes]);

  // Weekly revenue for the last 4 weeks
  const weeklyRevenueData = useMemo(() => {
    const now = new Date();
    const getWeek = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return `${date.getFullYear()}-W${String(Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)).padStart(2, "0")}`;
    };
    const grouped = groupRevenueBy(commandes, getWeek);
    // Get last 4 weeks
    const weeks = Array.from({ length: 4 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - 7 * (3 - i));
      return getWeek(d);
    });
    return weeks.map((week) => ({
      x: week,
      y: grouped.find((g) => g.x === week)?.y || 0,
    }));
  }, [commandes]);

  // Monthly revenue for the last 6 months
  const monthlyRevenueData = useMemo(() => {
    const now = new Date();
    const getMonth = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const grouped = groupRevenueBy(commandes, getMonth);
    // Get last 6 months
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return getMonth(d);
    });
    return months.map((month) => ({
      x: month,
      y: grouped.find((g) => g.x === month)?.y || 0,
    }));
  }, [commandes]);

  // Select data based on time range
  const chartData = (() => {
    switch (timeRange) {
      case 'day':
        return dailyRevenueData;
      case 'week':
        return weeklyRevenueData;
      case 'month':
        return monthlyRevenueData;
      default:
        return dailyRevenueData;
    }
  })();

  const series = [
    {
      name: 'Revenue',
      data: chartData.map(item => item.y)
    }
  ];

  const options = {
    chart: {
      type: "area" as const,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "smooth" as "smooth",
      width: 3
    },
    colors: ['#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: chartData.map(item => item.x),
      labels: {
        style: {
          colors: '#64748b',
          fontFamily: 'Inter, sans-serif'
        }
      },
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontFamily: 'Inter, sans-serif'
        },
        formatter: (value: number) => {
          return `${value} Dhs`;
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    tooltip: {
      x: {
        show: false
      },
      y: {
        formatter: (value: number) => {
          return `${value.toLocaleString()} Dhs`;
        }
      },
      theme: 'light'
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Revenue Overview</h3>

        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'day'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('day')}
          >
            Daily
          </button>

          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'week'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Weekly
          </button>

          <button
            className={`px-3 py-1 rounded-md text-sm ${
              timeRange === 'month'
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="h-80">
        <Chart
          options={options}
          series={series}
          type="area"
          height="100%"
        />
      </div>
    </div>
  )
};

export default RevenueChart;
