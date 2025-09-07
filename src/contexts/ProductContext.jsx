import React, { createContext, useState, useContext } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../APIs/ProductsAPI';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getProducts();
            setProducts(data);
            setProductsCount(data.length);
            return data;
        } catch (err) {
            setError('Failed to fetch products');
            console.error('Error fetching products:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Add a new product
    const addProduct = async (productData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await createProduct(productData);
            const newProduct = response.data;
            setProducts(prev => [...prev, newProduct]);
            setProductsCount(prev => prev + 1);
            return newProduct;
        } catch (err) {
            setError('Failed to add product');
            console.error('Error adding product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update an existing product
    const editProduct = async (productId, productData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await updateProduct(productId, productData);
            const updatedProduct = response.category;
            setProducts(prev => 
                prev.map(product => 
                    product.productId === productId ? updatedProduct : product
                )
            );
            return updatedProduct;
        } catch (err) {
            setError('Failed to update product');
            console.error('Error updating product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a product
    const removeProduct = async (productId) => {
        try {
            setLoading(true);
            setError(null);
            await deleteProduct(productId);
            setProducts(prev => prev.filter(product => product.productId !== productId));
            setProductsCount(prev => prev - 1);
        } catch (err) {
            setError('Failed to delete product');
            console.error('Error deleting product:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get product by ID
    const getProductById = (productId) => {
        return products.find(product => product.productId === productId);
    };

    const value = {
        products,
        productsCount,
        loading,
        error,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
        getProductById,
        setProducts,
        setProductsCount,
        setError
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

// Custom hook to use ProductContext
export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};