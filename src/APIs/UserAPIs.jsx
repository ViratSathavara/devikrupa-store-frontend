import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// GET all users (admin only)
export const getUsers = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.role) queryParams.append('role', params.role);
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient.get(`/auth?${queryParams.toString()}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET user by ID (admin only)
export const getUserById = async (userId) => {
    try {
        const response = await apiClient.get(`/auth/${userId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// CREATE new user (admin only)
export const createUser = async (userData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('firstname', userData.firstname);
        formData.append('lastname', userData.lastname);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);
        formData.append('password', userData.password);
        formData.append('role', userData.role || 'user');
        
        if (userData.secretId) {
            formData.append('secretId', userData.secretId);
        }

        // Add image file
        if (userData.image) {
            formData.append('image', userData.image);
        }

        const response = await apiClient.post('/auth/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// UPDATE user (admin only)
export const updateUser = async (userId, userData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('firstname', userData.firstname);
        formData.append('lastname', userData.lastname);
        formData.append('email', userData.email);
        formData.append('phone', userData.phone);

        // Add image file
        if (userData.image) {
            formData.append('image', userData.image);
        }

        const response = await apiClient.put(`/auth/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// DELETE user (admin only)
export const deleteUser = async (userId) => {
    try {
        const response = await apiClient.delete(`/auth/${userId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// CHANGE user role (admin only)
export const changeUserRole = async (userId, roleData) => {
    try {
        const response = await apiClient.put(`/auth/${userId}/role`, roleData);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// RESET user password (admin only)
export const resetUserPassword = async (userId, passwordData) => {
    try {
        const response = await apiClient.put(`/auth/${userId}/reset-password`, passwordData);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET user statistics (admin only)
export const getUserStats = async () => {
    try {
        const response = await apiClient.get('/auth/stats/overview');
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};
