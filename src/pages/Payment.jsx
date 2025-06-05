// PaymentPage.jsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '../components/CheckoutForm';

// Replace with your publishable test key
const stripePromise = loadStripe('pk_test_51RT74mFQfmJk6ApXGXHP8H9Shs1MjXUGqusVbxYla8OdBHNotIwVvPwizgkx4kNYZcbSo1oXv4gsSebSQNsghNSP00bbEULTDh');

const Payment = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Payment;
