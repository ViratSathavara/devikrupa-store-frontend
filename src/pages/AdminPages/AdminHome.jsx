import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiFolder,
  FiBarChart,
  FiTrendingUp,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";
import { getUsers, getUserStats } from "../../APIs/UserAPIs";
import { getCategories, getCategoryStats } from "../../APIs/CategoryAPIs";
import { getProducts } from "../../APIs/ProductsAPI";
import { getAllOrders } from "../../APIs/OrderAPIs";

const AdminHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    categories: 0,
    revenue: 0,
    recentUsers: [],
    recentOrders: [],
    recentProducts: [],
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  console.log("AdminHome", stats);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersData, categoriesData, productsData, ordersData] =
        await Promise.all([
          getUserStats(),
          getCategoryStats(),
          getProducts(),
          getAllOrders(),
        ]);

      console.log(usersData, categoriesData, productsData, ordersData);

      setStats({
        users: usersData.data?.totalUsers || 0,
        products: productsData.length || 0,
        orders: ordersData.length || 0,
        categories: categoriesData.data?.totalCategories || 0,
        revenue: ordersData.reduce(
          (sum, order) => sum + (order.totalPrice || 0),
          0
        ),
        recentUsers: usersData.data?.recentUsers || [],
        recentOrders: ordersData.slice(0, 5) || [],
        recentProducts: productsData.slice(0, 5) || [],
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const adminFeatures = [
    {
      title: "Product Management",
      description:
        "Add, edit, and manage all products with images and categories",
      icon: FiPackage,
      link: "/admin/products",
      color: "blue",
      count: stats.products,
    },
    {
      title: "Category Management",
      description:
        "Organize products with categories and manage category details",
      icon: FiFolder,
      link: "/admin/categories",
      color: "purple",
      count: stats.categories,
    },
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions",
      icon: FiUsers,
      link: "/admin/users",
      color: "green",
      count: stats.users,
    },
    {
      title: "Order Management",
      description: "View and manage customer orders and order status",
      icon: FiShoppingCart,
      link: "/admin/orders",
      color: "red",
      count: stats.orders,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.users}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiPackage className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.products}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.orders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.revenue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminFeatures.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 hover:scale-105"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-3 rounded-lg bg-${feature.color}-100 group-hover:bg-${feature.color}-200 transition-colors`}
                  >
                    <feature.icon
                      className={`w-6 h-6 text-${feature.color}-600`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {feature.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {feature.count} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Users
            </h3>
            <div className="space-y-3">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.firstname?.charAt(0)}
                        {user.lastname?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent users</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Orders
            </h3>
            <div className="space-y-3">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order._id?.slice(-8)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user?.firstname} {order.user?.lastname}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{order.totalPrice}
                      </p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status || "pending"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent orders</p>
              )}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center space-x-4">
            <FiActivity className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">
                Welcome to Devikrupa Electricals Admin Panel
              </h3>
              <p className="text-blue-100 mt-1">
                Manage your electrical store with powerful admin tools. Add
                products, manage categories, handle orders, and monitor user
                activity all from one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
