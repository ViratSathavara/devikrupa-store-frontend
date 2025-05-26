import { useState, useEffect } from 'react';
import axios from 'axios';

const OTPVerification = ({ email, onVerifySuccess, onBack }) => {
    const [otp, setOtp] = useState('');
    const [countdown, setCountdown] = useState(60);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/auth/verify-otp', {
                email,
                otp
            });

            if (response.data.success) {
                onVerifySuccess(response.data);
            } else {
                setError(response.data.message || 'OTP verification failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            await axios.post('http://localhost:5000/auth/resend-otp', { email });
            setCountdown(60);
        } catch (error) {
            setError('Failed to resend OTP');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center overflow-auto max-h-screen bg-black/60 z-30">
            <form
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()}
                className="flex flex-col gap-4 p-8 w-80 sm:w-[352px] bg-white rounded shadow-xl"
            >
                <h2 className="m-auto text-20 font-medium">
                    <span className="text-indigo-500">Verify</span> Email
                </h2>

                <p className="text-sm text-center">
                    We've sent a 6-digit code to <span className="font-semibold">{email}</span>
                </p>

                <label>OTP Code</label>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="border rounded p-2 outline-indigo-500"
                    placeholder="Enter 6-digit OTP"
                    required
                />

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-indigo-500 hover:text-indigo-700 text-sm"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={resendOTP}
                        disabled={countdown > 0}
                        className={`text-sm ${countdown > 0 ? 'text-gray-400' : 'text-indigo-500 hover:text-indigo-700'}`}
                    >
                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={otp.length !== 6 || loading}
                    className={`bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded transition ${(otp.length !== 6 || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </form>
        </div>
    );
};

export default OTPVerification;