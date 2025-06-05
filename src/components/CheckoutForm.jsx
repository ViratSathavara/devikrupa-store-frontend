import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');

            // 1. Create payment intent
            const paymentIntentRes = await axios.post(
                'http://localhost:5000/auth/create-payment-intent',
                { amount: totalPrice * 100 }, // Convert to cents/paisa
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { clientSecret } = paymentIntentRes.data;

            // 2. Confirm card payment with Stripe
            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (paymentResult.error) {
                setMessage(paymentResult.error.message);
                return;
            }

            if (paymentResult.paymentIntent.status === 'succeeded') {
                // 3. Create order in backend
                const products = cart.map(item => ({
                    image: item.product.productImages[0],
                    productName: item.product.name,
                    productId: item.product.productId,
                    quantity: item.quantity,
                    price: item.product.price
                }));

                const orderRes = await axios.post(
                    'http://localhost:5000/orders',
                    {
                        products,
                        totalPrice
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log('orderRes', orderRes);

                clearCart();
                setMessage('✅ Payment successful! Order created.');

                // Redirect to orders page after 2 seconds
                setTimeout(() => navigate('/my-orders'), 2000);
            }
        } catch (error) {
            console.error('Payment error:', error);
            setMessage(error.response?.data?.message || '❌ Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg space-y-6"
        >
            <h2 className="text-20 font-bold text-center mb-4">Complete Payment</h2>
            <p className="text-center font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>

            <div className="border p-3 rounded-md shadow-sm bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#333',
                                '::placeholder': {
                                    color: '#a0aec0',
                                },
                            },
                            invalid: {
                                color: '#e53e3e',
                            },
                        },
                    }}
                />
            </div>

            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full py-3 px-4 rounded-md text-white font-semibold transition duration-200 ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? 'Processing...' : `Pay ₹${totalPrice.toFixed(2)}`}
            </button>

            {message && (
                <p
                    className={`text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-500'
                        }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
};

export default CheckoutForm;