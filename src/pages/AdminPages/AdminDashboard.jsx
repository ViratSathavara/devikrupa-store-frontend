import React, { useState, useEffect } from 'react';
import { getAdminDashboard, getAdminAnalytics } from '../../APIs/AdminAPIs';
import { 
  FiUsers, 
  FiPackage, 
  FiShoppingCart, 
  FiTrendingUp,
  FiActivity,
  FiBarChart,
  FiRefreshCw
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  console.log("dashboardData", dashboardData);
  const [analyticsData, setAnalyticsData] = useState(null);
  console.log("analyticsData", analyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboard, analytics] = await Promise.all([
        getAdminDashboard(),
        getAdminAnalytics(selectedPeriod)
      ]);
      setDashboardData(dashboard);
      setAnalyticsData(analytics);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, changeType, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-1 text-sm ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              <FiTrendingUp className="w-4 h-4 mr-1" />
              {change}% from last period
            </div>
          )}
        </div>
        <div className={`w-32 h-32 rounded-full bg-${color}-100`}>
          <Icon className={`p-2 w-full h-full text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity, time }) => (
    <div className="flex items-center space-x-3 py-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={dashboardData?.data?.users?.total}
          icon={FiUsers}
          change={analyticsData?.data?.userGrowth}
          changeType="increase"
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={dashboardData?.data?.products?.total}
          icon={FiPackage}
          change={analyticsData?.data?.productGrowth}
          changeType="increase"
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData?.data?.orders?.total}
          icon={FiShoppingCart}
          change={analyticsData?.data?.orderGrowth}
          changeType="increase"
          color="purple"
        />
        <StatCard
          title="Total Categories"
          value={dashboardData?.data?.categories?.total}
            icon={FiBarChart}
          change={analyticsData?.data?.categoryGrowth}
          changeType="increase"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Statistics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Statistics</h3>
          <div className="space-y-4">
            {dashboardData?.data?.monthlyStats?.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{stat.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Users: {stat.users}</span>
                  <span className="text-sm font-medium">Orders: {stat.orders}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
          <div className="space-y-3">
            {dashboardData?.data?.roleDistribution?.map((role, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{role.role}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(role.count / dashboardData.data.users.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-8">{role.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FiActivity className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-1">
          {dashboardData?.data?.recentActivity?.map((activity, index) => (
            <ActivityItem
              key={index}
              activity={activity.description}
              time={activity.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
