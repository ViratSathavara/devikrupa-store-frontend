// App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { LoginContext } from './contexts/LoginContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/AllProducts';
import Services from './pages/Services';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminPages/AdminDashboard';
import AdminUsersEnhanced from './pages/AdminPages/AdminUsersEnhanced';
import AdminCategoriesEnhanced from './pages/AdminPages/AdminCategoriesEnhanced';
import AdminSearch from './pages/AdminPages/AdminSearch';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotFound from './components/NotFound';
import PublicRoute from './components/PublicRoute';
import { ToastContainer } from 'react-toastify';
import SelectedCategoryProduct from './components/SelectedCastegoryProduct';
import Payment from './pages/Payment';
import AdminProducts from './pages/AdminPages/AdminProducts';
import AdminCategories from './pages/AdminPages/AdminCategories';
import AdminUsers from './pages/AdminPages/AdminUsers';
import AdminOrders from './pages/AdminPages/AdminOrders';
import AdminRestrictedRoute from './components/AdminRestrictedRoute';
import AdminHome from './pages/AdminPages/AdminHome';

const hideFooterPaths = ['/login', '/signup', '/verifyOTP', '/profile'];

function App() {
  const location = useLocation();
  const { role } = useContext(LoginContext);
  const shouldShowFooter = role !== 'admin' && !hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>

          <Route element={<AdminRestrictedRoute />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          {/* User-only routes */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/services" element={<Services />} />
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/payment" element={<Payment />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:categoryname" element={<SelectedCategoryProduct />} />

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard-old" element={<AdminHome />} />
            <Route path="/adminproducts" element={<AdminProducts />} />
            <Route path="/categories" element={<AdminCategoriesEnhanced />} />
            <Route path="/categpories" element={<AdminCategories />} />
            <Route path="/users" element={<AdminUsersEnhanced />} />
            <Route path="/users-old" element={<AdminUsers />} />
            <Route path="/admin/search" element={<AdminSearch />} />
            <Route path="/orders" element={<AdminOrders />} />
          </Route>

          {/* Common protected route for both */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'user']} />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* 404 Page for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>

      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
