import axios from 'axios';

export const loginUser = async (userData) => {

    try {
        const response = await axios.post('http://localhost:5000/auth/login', { userData });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return { error: error.response?.data?.message || error.message };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                error.message,
            success: false
        };
    }
};

export const verifyOTP = async (otpData) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/verify-otp', otpData);
        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                error.message,
            success: false
        };
    }
};

export const resendOTP = async (email) => {
    try {
        const response = await axios.post('http://localhost:5000/auth/resend-otp', { email });
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                error.message,
            success: false
        };
    }
};

export const logoutUser = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get('http://localhost:5000/auth/logout', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            localStorage.clear();
            setToken(null);
            setUser(null);
            setRole(null);
            window.location.reload();
            history.push('/login');

            return response.data;
        }
    } catch (error) {
        return {
            error: error.response?.data?.message ||
                error.response?.data?.error ||
                error.message,
            success: false
        };
    }
};
