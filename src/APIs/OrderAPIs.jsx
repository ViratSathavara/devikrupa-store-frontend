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

// CREATE new order (user only)
export const createOrder = async (orderData) => {
    try {
        const response = await apiClient.post('/orders', orderData);
        if (response.status === 201) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET my orders (user only)
export const getMyOrders = async () => {
    try {
        const response = await apiClient.get('/orders/my');
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET all orders (admin only)
export const getAllOrders = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page);
        if (params.limit) queryParams.append('limit', params.limit);
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);

        const response = await apiClient.get(`/orders?${queryParams.toString()}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET order by ID (admin only)
export const getOrderById = async (orderId) => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// UPDATE order status (admin only)
export const updateOrderStatus = async (orderId, statusData) => {
    try {
        const response = await apiClient.put(`/orders/${orderId}`, statusData);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// DELETE order (admin only)
export const deleteOrder = async (orderId) => {
    try {
        const response = await apiClient.delete(`/orders/${orderId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

// GET order statistics (admin only)
export const getOrderStats = async () => {
    try {
        const response = await apiClient.get('/orders/stats');
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};
