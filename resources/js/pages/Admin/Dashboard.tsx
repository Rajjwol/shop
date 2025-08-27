import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { FiUsers, FiShoppingCart, FiBarChart2, FiSettings } from 'react-icons/fi';
import { usePage } from '@inertiajs/react';

interface StatsProps {
  users: number;
  orders: number;
  revenue: number;
}

interface CardProps {
  id: number;
  title: string;
  value: number | string;
  icon: React.ReactNode;
  percentage: number; // 0 to 100
}

interface Purchase {
  id: number;
  user: string;
  product: string;
  quantity: number;
  total: number;
  created_at: string;
}

export default function Dashboard() {
  const page = usePage<{ stats?: StatsProps; recentPurchases?: Purchase[] }>();
  const stats = page.props.stats;
  const recentPurchases = page.props.recentPurchases || [];

  if (!stats) {
    return (
      <AdminLayout title="Dashboard">
        <div className="p-6 text-center text-gray-600 dark:text-gray-300">
          Loading dashboard...
        </div>
      </AdminLayout>
    );
  }

  const cards: CardProps[] = [
    { id: 1, title: 'Users', value: stats.users, icon: <FiUsers className="w-6 h-6 text-white" />, percentage: Math.min((stats.users / 1000) * 100, 100) },
    { id: 2, title: 'Orders', value: stats.orders, icon: <FiShoppingCart className="w-6 h-6 text-white" />, percentage: Math.min((stats.orders / 500) * 100, 100) },
    { id: 3, title: 'Revenue', value: `$${stats.revenue}`, icon: <FiBarChart2 className="w-6 h-6 text-white" />, percentage: Math.min((Number(stats.revenue) / 20000) * 100, 100) },
    { id: 4, title: 'Settings', value: '', icon: <FiSettings className="w-6 h-6 text-white" />, percentage: 100 },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          Welcome to Admin Dashboard
        </h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const size = 64;
            const strokeWidth = 6;
            const radius = (size - strokeWidth) / 2;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (card.percentage / 100) * circumference;

            return (
              <div
                key={card.id}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
              >
                <div>
                  <p className="text-white text-sm font-medium">{card.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{card.value}</p>
                </div>

                <div className="relative w-16 h-16">
                  <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    <circle
                      stroke="white"
                      strokeOpacity={0.2}
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      r={radius}
                      cx={size / 2}
                      cy={size / 2}
                    />
                    <circle
                      stroke="white"
                      fill="transparent"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      r={radius}
                      cx={size / 2}
                      cy={size / 2}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {card.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h2>
          {recentPurchases.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">No recent purchases.</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">User</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Product</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Quantity</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Total</th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{purchase.user}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{purchase.product}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{purchase.quantity}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">${purchase.total}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{purchase.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
