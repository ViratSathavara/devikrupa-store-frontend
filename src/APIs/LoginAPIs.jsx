import { apiPost } from '../config/axiosConfig';

export const loginUser = async (userData) => {
    try {
        const result = await apiPost('/auth/login', { userData });
        
        if (result.success) {
            return result.data;
        } else {
            return { 
                error: result.error,
                success: false 
            };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { 
            error: error.message || 'Login failed',
            success: false 
        };
    }
};

export const registerUser = async (userData) => {
    try {
        const result = await apiPost('/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (result.success) {
            return result.data;
        } else {
            return {
                error: result.error,
                success: false
            };
        }
    } catch (error) {
        console.error('Registration error:', error);
        return {
            error: error.message || 'Registration failed',
            success: false
        };
    }
};

export const verifyOTP = async (otpData) => {
    try {
        const result = await apiPost('/auth/verify-otp', otpData);
        
        if (result.success) {
            return result.data;
        } else {
            return {
                error: result.error,
                success: false
            };
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        return {
            error: error.message || 'OTP verification failed',
            success: false
        };
    }
};

export const resendOTP = async (email) => {
    try {
        const result = await apiPost('/auth/resend-otp', { email });
        
        if (result.success) {
            return result.data;
        } else {
            return {
                error: result.error,
                success: false
            };
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        return {
            error: error.message || 'Failed to resend OTP',
            success: false
        };
    }
};

export const logoutUser = async () => {
    try {
        const result = await apiGet('/auth/logout');
        
        if (result.success) {
            localStorage.clear();
            window.location.reload();
            return result.data;
        } else {
            return {
                error: result.error,
                success: false
            };
        }
    } catch (error) {
        console.error('Logout error:', error);
        // Clear local storage even if logout fails
        localStorage.clear();
        window.location.reload();
        return {
            error: error.message || 'Logout failed',
            success: false
        };
    }
};
