import { apiGet, apiPost, apiPut, apiDelete } from '../config/axiosConfig';

// GET all categories (public)
export const getCategories = async () => {
    try {
        const result = await apiGet('/categories');
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get categories error:', error);
        throw error;
    }
};

// GET category by ID (admin only)
export const getCategoryById = async (categoryId) => {
    try {
        const result = await apiGet(`/categories/${categoryId}`);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get category by ID error:', error);
        throw error;
    }
};

// CREATE new category (admin only)
export const createCategory = async (categoryData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('categoryName', categoryData.categoryName);
        formData.append('description', categoryData.description || '');
        formData.append('bgColor', categoryData.bgColor || '#3B82F6');

        // Add image file
        if (categoryData.categoryImage) {
            formData.append('categoryImage', categoryData.categoryImage);
        }

        const result = await apiPost('/categories', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Create category error:', error);
        throw error;
    }
};

// UPDATE category (admin only)
export const updateCategory = async (categoryId, categoryData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('categoryName', categoryData.categoryName);
        formData.append('description', categoryData.description || '');
        formData.append('bgColor', categoryData.bgColor || '#3B82F6');

        // Add image file
        if (categoryData.categoryImage) {
            formData.append('categoryImage', categoryData.categoryImage);
        }

        const result = await apiPut(`/categories/${categoryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Update category error:', error);
        throw error;
    }
};

// DELETE category (admin only)
export const deleteCategory = async (categoryId) => {
    try {
        const result = await apiDelete(`/categories/${categoryId}`);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Delete category error:', error);
        throw error;
    }
};

// GET category statistics (admin only)
export const getCategoryStats = async () => {
    try {
        const result = await apiGet('/categories/stats');
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get category stats error:', error);
        throw error;
    }
};