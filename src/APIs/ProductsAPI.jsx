import axios from 'axios';

export const getProducts = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/products`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getproductsByCategoryId = async (categoryId) => {
    try {
        const response = await axios.get(`http://localhost:5000/products/category/${categoryId?.categoryName}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
    }
};