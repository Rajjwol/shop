import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { FiUsers, FiShoppingCart, FiBarChart2, FiSettings } from 'react-icons/fi';

interface DashboardProps {
  title: string;
}

const stats = [
  { id: 1, title: 'Users', value: '1,234', icon: <FiUsers className="w-6 h-6 text-white" /> },
  { id: 2, title: 'Orders', value: '567', icon: <FiShoppingCart className="w-6 h-6 text-white" /> },
  { id: 3, title: 'Revenue', value: '$12,345', icon: <FiBarChart2 className="w-6 h-6 text-white" /> },
  { id: 4, title: 'Settings', value: '', icon: <FiSettings className="w-6 h-6 text-white" /> },
];

export default function Dashboard({ title }: DashboardProps) {
  return (
    <AdminLayout title={title}>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your site content and track performance metrics.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-xl shadow-lg flex items-center justify-between transition-transform transform hover:scale-105"
            >
              <div>
                <p className="text-white text-sm font-medium">{stat.title}</p>
                <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="bg-white bg-opacity-25 p-3 rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Recent Activity</h2>
            <p className="text-gray-500 dark:text-gray-300">
              Track recent updates, orders, or user activity here.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Analytics</h2>
            <p className="text-gray-500 dark:text-gray-300">
              View graphs or key performance indicators here.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
