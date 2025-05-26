import React, { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [product, setProduct] = useState([]);
    const [productsCount, setProductsCount] = useState([]);

    return (
        <ProductContext.Provider value={{ product, setProduct, productsCount, setProductsCount }}>
            {children}
        </ProductContext.Provider>
    );
};