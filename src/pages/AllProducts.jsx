import React, { useContext, useEffect } from 'react'
import { ProductContext } from '../contexts/ProductContext';
import { FiShoppingCart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getProducts } from '../APIs/ProductsAPI';

const AllProducts = () => {
  const { product, setProduct, productsCount, setProductsCount } = useContext(ProductContext);

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

      const handleAddToCart = (productId) => {
        setProductsCount(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

      const handleIncrement = (productId) => {
        setProductsCount(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const handleDecrement = (productId) => {
        setProductsCount(prev => ({
            ...prev,
            [productId]: Math.max((prev[productId] || 0) - 1, 0)
        }));
    };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {product.map((product) => (
          <div key={product.id} className="flex">
            <div className="bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all flex flex-col w-full">
              <div className="relative w-full mb-3" style={{ height: '140px' }}>
                <img
                  src={`http://localhost:5000${product.productImages[0]}`}
                  alt={product.name}
                  className="w-full h-full object-contain"
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
              </div>
              {!productsCount[product.productId] ? (
                <button
                  onClick={() => handleAddToCart(product.productId)}
                  className="mt-3 flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  <FiShoppingCart className="mr-2" />
                  Add to Cart
                </button>
              ) : (
                <div className="mt-3 flex items-center justify-center w-full py-2 bg-blue-200 text-black rounded hover:bg-blue-300 transition">
                  <button
                    onClick={() => handleDecrement(product.productId)}
                    className="cursor-pointer text-lg px-3 h-full flex items-center"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">{productsCount[product.productId]}</span>
                  <button
                    onClick={() => handleIncrement(product.productId)}
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
  )
}

export default AllProducts