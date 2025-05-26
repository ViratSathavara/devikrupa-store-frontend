import axios from 'axios';

export const getCategories = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/categories`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};