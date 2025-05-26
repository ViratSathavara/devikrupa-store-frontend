import React, { useState, useRef, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { registerUser, resendOTP, verifyOTP } from '../APIs/LoginAPIs';
import { LoginContext } from '../contexts/LoginContext';

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [otpStep, setOtpStep] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [registrationData, setRegistrationData] = useState(null);
    const fileInputRef = useRef(null);
    const { handleAuthSuccess } = useContext(LoginContext);

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('firstname', firstName);
            formData.append('lastname', lastName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);

            if (fileInputRef.current?.files[0]) {
                formData.append('image', fileInputRef.current.files[0]);
            }

            const formDataObj = {};
            for (let [key, value] of formData.entries()) {
                formDataObj[key] = value;
            }

            const result = await registerUser(formDataObj);
            if (result?.status === 200) {
                setRegistrationData(formDataObj);
                toast.success(result?.message);
                setOtpStep(true);
                setResendTimer(30);
            } else {
                setError(result?.message || 'Registration failed');
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        const result = await resendOTP(email);
        if (result?.status === 200) {
        toast.success(result?.message);
        }
        setResendTimer(30);
    };

    const handleVerifyOtp = async () => {
        setIsLoading(true);
        try {

            const result = await verifyOTP({ email, otp });
            if (result?.status === 201) {
                handleAuthSuccess(result?.data?.token, result?.data?.user);
                setShowUserLogin(false);
                const userRole = result?.data?.user?.role;
                toast.success('User Registration Successfully!');
                if (userRole === "admin") {
                    navigate('/adminhome');
                } else if (userRole === "user") {
                    navigate('/');
                }
            }
        } catch (error) {
            toast.error(error)
        } finally {
            setIsLoading(true);
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

    if (otpStep) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Verify OTP</h2>
                    <label className="block mb-1 text-sm font-medium">Enter OTP</label>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP sent to your email"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Verify OTP
                    </button>

                    <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={handleResendOtp}
                        className="mt-3 text-blue-600 text-sm hover:underline disabled:text-gray-400"
                    >
                        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                    </button>

                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6 overflow-auto">
            <form
                onSubmit={handleSignup}
                className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl"
            >
                <h2 className="text-20 font-semibold mb-6 text-center">Signup</h2>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block mb-1 text-sm font-medium">Profile Image</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                    Signup
                </button>

                <p className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;
