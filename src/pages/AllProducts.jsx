// src/pages/AllProducts.js
import React, { useContext, useEffect } from 'react';
import { ProductContext } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getProducts } from '../APIs/ProductsAPI';
import { useLocation } from 'react-router-dom';
import ImageWithFallback from '../components/ImageWithFallback';

const AllProducts = () => {
  const { product, setProduct } = useContext(ProductContext);
  const { addToCart, cart } = useCart();
  const location = useLocation();
  const productsFromState = location?.state?.products || [];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProduct(response);
      } catch (error) {
        console.error('Full error:', error);
      }
    };
    fetchProducts();
  }, []);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const getCartQuantity = (productId) => {
    const cartItem = cart.find(item => item.product.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((product) => (
          <div key={product.id} className="flex">
            <div className="bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col w-full">
              <div className="relative w-full mb-3" style={{ height: '140px' }}>
                <ImageWithFallback
                  src={product.productImages && product.productImages.length > 0 
                    ? `http://localhost:5000${product.productImages[0]}` 
                    : null
                  }
                  alt={product.name}
                  className="w-full h-full object-contain"
                  fallbackText="No Image"
                />
              </div>
              <div className="flex-grow">
                <span className="text-xs text-gray-600">{product.category}</span>
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="ml-1 text-sm">{product.rating}/5</span>
                </div>
                <p className="font-bold text-lg">${product.price}</p>
              </div>
              {getCartQuantity(product.productId) === 0 ? (
                <button
                  onClick={() => addToCart(product)}
                  className="mt-3 flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              ) : (
                <div className="mt-3 flex items-center justify-center w-full py-2 bg-blue-200 text-black rounded hover:bg-blue-300 transition">
                  <button
                    onClick={() => addToCart(product, -1)}
                    className="cursor-pointer text-lg px-3 h-full flex items-center"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">{getCartQuantity(product.productId)}</span>
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="cursor-pointer text-lg px-3 h-full flex items-center"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;