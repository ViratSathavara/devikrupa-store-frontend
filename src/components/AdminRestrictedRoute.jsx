// components/AdminRestrictedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const AdminRestrictedRoute = () => {
    const role = localStorage.getItem('role'); // Assuming role is stored in localStorage
  
  // If user is admin, redirect to admin dashboard
  if (role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // Otherwise, render the requested component
  return <Outlet />;
};

export default AdminRestrictedRoute;