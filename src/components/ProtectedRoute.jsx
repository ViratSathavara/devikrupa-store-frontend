// components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useContext(LoginContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
