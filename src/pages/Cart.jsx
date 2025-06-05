// src/pages/Cart.js
import React from 'react';
import { useCart } from '../contexts/CartContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import emptyCartGif from '../assets/emptycart.png';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/payment');
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen">
      <h1 className="text-20 font-bold mb-6">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="gap-6 text-center py-12 items-center flex flex-col">
          <img className='w-160 ' src={emptyCartGif} alt="Empty Cart" />
          <div>
          <h2 className="text-20 font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600">Start shopping to add items to your cart</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.product.productId} className="p-4 flex">
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={`http://localhost:5000${item.product.productImages[0]}`}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="font-semibold">${item.product.price * item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.product.category}</p>
                      <div className="mt-2 flex items-center">
                        <button
                          onClick={() => updateQuantity(item.product.productId, item.quantity - 1)}
                          className="px-2 py-1 border rounded-l"
                        >
                          -
                        </button>
                        <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.productId, item.quantity + 1)}
                          className="px-2 py-1 border rounded-r"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.productId)}
                          className="ml-4 text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={clearCart}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Clear Cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-20 font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className='font-semibold text-lg'>Items</span>
                </div>
                {cart.map((item) => (
                  <div className="flex justify-between">
                    <span>{item.product.name} ({item.quantity})</span>
                    <span>{item.quantity * item.product.price}</span>
                  </div>
                ))}
                <div className="flex mt-6 justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <button
                onClick={() => handleCheckout()}
                className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;