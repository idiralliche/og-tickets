import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const pk = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

const stripePromise = loadStripe(pk);

export default function StripeWrapper({ children }) {
  return <Elements stripe={stripePromise}>{children}</Elements>;
}
