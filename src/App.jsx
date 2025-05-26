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
import AdminHome from './pages/AdminHome';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import NotFound from './components/NotFound';
import { ToastContainer } from 'react-toastify';

const hideFooterPaths = ['/login', '/signup', '/verifyOTP'];

function App() {
  const location = useLocation();
  const { role } = useContext(LoginContext);
  const shouldShowFooter = role !== 'admin' && !hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* User-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/adminhome" element={<AdminHome />} />
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
