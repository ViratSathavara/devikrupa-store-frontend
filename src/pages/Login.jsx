import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../APIs/LoginAPIs';
import { LoginContext } from '../contexts/LoginContext';
import history from '../../history';
import { toast } from 'react-toastify';

const Login = () => {
  const [error, setError] = useState('');
  const { role, handleAuthSuccess } = useContext(LoginContext);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const formDataObj = {};
      for (let [key, value] of formData.entries()) {
        formDataObj[key] = value;
      }

      const result = await loginUser(formDataObj);

      if (result?.status === 200) {
        handleAuthSuccess(result?.data?.token, result?.data?.user);
        toast.success("Login successful")
        const userRole = result?.data?.user?.role;

        if (userRole === "admin") {
          navigate('/admin/dashboard');
        } else if (userRole === "user") {
          navigate('/');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
          <p className="ml-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-20 font-semibold mb-6 text-center">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
