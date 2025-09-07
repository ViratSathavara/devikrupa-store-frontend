import { apiGet, apiPost, apiPut, apiDelete } from '../config/axiosConfig';

// GET all products
export const getProducts = async () => {
    try {
        const result = await apiGet('/products');
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get products error:', error);
        throw error;
    }
};

// GET product by ID
export const getProductById = async (productId) => {
    try {
        const result = await apiGet(`/products/${productId}`);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get product by ID error:', error);
        throw error;
    }
};

// GET products by category
export const getproductsByCategoryId = async (categoryId) => {
    try {
        const result = await apiGet(`/products/category/${categoryId?.categoryName}`);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Get products by category error:', error);
        throw error;
    }
};

// CREATE new product
export const createProduct = async (productData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('name', productData.name);
        formData.append('companyName', productData.companyName);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categoryId', productData.categoryId);
        formData.append('stock', productData.stock);
        formData.append('rating', productData.rating);

        // Add image files
        if (productData.productImages && productData.productImages.length > 0) {
            productData.productImages.forEach((file, index) => {
                formData.append('productImages', file);
            });
        }

        const result = await apiPost('/products', formData, {
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
        console.error('Create product error:', error);
        throw error;
    }
};

// UPDATE product
export const updateProduct = async (productId, productData) => {
    try {
        const formData = new FormData();
        
        // Add text fields
        formData.append('name', productData.name);
        formData.append('companyName', productData.companyName);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categoryId', productData.categoryId);
        formData.append('stock', productData.stock);
        formData.append('rating', productData.rating);

        // Add image files
        if (productData.productImages && productData.productImages.length > 0) {
            productData.productImages.forEach((file, index) => {
                formData.append('productImages', file);
            });
        }

        const result = await apiPut(`/products/${productId}`, formData, {
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
        console.error('Update product error:', error);
        throw error;
    }
};

// DELETE product
export const deleteProduct = async (productId) => {
    try {
        const result = await apiDelete(`/products/${productId}`);
        
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Delete product error:', error);
        throw error;
    }
};