import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Get auth token from localStorage
const getAuthToken = () => {
    return localStorage.getItem('token');
};

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for consistent error handling
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    window.location.href = '/login';
                    break;
                case 403:
                    console.error('Forbidden: Access denied');
                    break;
                case 404:
                    console.error('Not Found: Resource not found');
                    break;
                case 500:
                    console.error('Server Error: Internal server error');
                    break;
                default:
                    console.error(`API Error ${status}:`, data?.message || 'Unknown error');
            }
        } else if (error.request) {
            // Network error
            console.error('Network Error: No response received');
        } else {
            // Other error
            console.error('Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Helper function for consistent API calls
export const apiCall = async (method, url, data = null, config = {}) => {
    try {
        const response = await apiClient({
            method,
            url,
            data,
            ...config
        });
        return {
            success: true,
            data: response.data,
            status: response.status
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 
                   error.response?.data?.error || 
                   error.message || 
                   'An error occurred',
            status: error.response?.status || 0
        };
    }
};

// Specific helper functions for common operations
export const apiGet = async (url, config = {}) => {
    return await apiCall('GET', url, null, config);
};

export const apiPost = async (url, data = null, config = {}) => {
    return await apiCall('POST', url, data, config);
};

export const apiPut = async (url, data = null, config = {}) => {
    return await apiCall('PUT', url, data, config);
};

export const apiDelete = async (url, config = {}) => {
    return await apiCall('DELETE', url, null, config);
};

export default apiClient;
