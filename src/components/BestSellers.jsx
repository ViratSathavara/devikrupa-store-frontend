import React, { useContext, useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FiShoppingCart } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { getProducts } from '../APIs/ProductsAPI';
import { ProductContext } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import ImageWithFallback from './ImageWithFallback';

const BestSellers = () => {
    const { products, setProducts, setProductsCount } = useContext(ProductContext);
    const { addToCart, cart } = useCart();
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response);
            } catch (error) {
                console.error('Full error:', error);
            }
        };
        fetchProducts();
    }, []);

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

    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1500,
        dots: false,
        arrows: false,
        speed: 700,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    const getCartQuantity = (productId) => {
        const cartItem = cart.find(item => item.product.productId === productId);
        return cartItem ? cartItem.quantity : 0;
    };

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

    return (
        <div className="p-6 bg-white">
            <h2 className="text-20 text-center font-bold mb-6">Best Sellers</h2>

            <Slider {...settings}>
                {products && products.filter((item) => item.rating >= 4).map((product) => (
                    <div key={product.id} className="px-2">
                        <div className={`bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-lg transition-all h-auto min-h-320 flex flex-col`}>
                            <div className="relative w-full" style={{ height: '100px' }}>
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

                                {/* <div className="flex items-center">
                  <span className="font-bold text-lg">₹{product.discountedPrice.toFixed(2)}</span>
                  <span className="ml-2 text-sm line-through text-gray-500">₹{product.originalPrice.toFixed(2)}</span>
                  <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                    {Math.round(100 - (product.discountedPrice / product.originalPrice * 100))}% OFF
                  </span>
                </div> */}
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
            </Slider>
        </div>
    );
};

export default BestSellers;