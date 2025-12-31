import React, { useState, useEffect } from 'react';
import {
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { shipmentAPI } from '../services/api';

function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);
      const response = await shipmentAPI.getDashboardMetrics();
      setMetrics(response.data. data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'badge-success';
      case 'In Transit':
        return 'badge-primary';
      case 'Pending':
        return 'badge-warning';
      default:
        return 'badge-gray';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Shipments',
      value: metrics?.shipments?. total || 0,
      icon: TruckIcon,
      bgColor: 'bg-blue-500',
      lightBg: 'bg-blue-50',
    },
    {
      name: 'Delivered',
      value: metrics?. shipments?.delivered || 0,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-500',
      lightBg: 'bg-green-50',
    },
    {
      name: 'In Transit',
      value: metrics?.shipments?.inTransit || 0,
      icon: ArrowTrendingUpIcon,
      bgColor: 'bg-orange-500',
      lightBg: 'bg-orange-50',
    },
    {
      name: 'Pending',
      value: metrics?.shipments?.pending || 0,
      icon: ClockIcon,
      bgColor: 'bg-yellow-500',
      lightBg: 'bg-yellow-50',
    },
    {
      name: 'Total Drivers',
      value: metrics?.drivers?.total || 0,
      icon: UserGroupIcon,
      bgColor: 'bg-purple-500',
      lightBg: 'bg-purple-50',
    },
    {
      name: 'Available Drivers',
      value: metrics?. drivers?.available || 0,
      icon: UserGroupIcon,
      bgColor: 'bg-teal-500',
      lightBg: 'bg-teal-50',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className={`card ${stat.lightBg} border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Shipments */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Shipments</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics?.recentShipments?.length > 0 ? (
                metrics.recentShipments.map((shipment) => (
                  <tr key={shipment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {shipment. shipmentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shipment. shipmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {shipment. driver?.name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusBadgeClass(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(shipment.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No recent shipments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;