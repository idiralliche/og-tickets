import { useCallback } from 'react';
import { useSecureFetch } from './useSecureFetch';

export function useStripePayment() {
  const secureFetch = useSecureFetch();
  /**
   * Base URL for the payment API.
   * @constant {string}
   */
  const BASE_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}api/payment`;

  const createPaymentIntent = useCallback(
    async (amount, currency = 'eur') => {
      const res = await secureFetch(`${BASE_URL}/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency }),
      });
      if (!res.ok)
        throw new Error('Erreur lors de la création du paiement Stripe');
      return await res.json(); // { clientSecret: ... }
    },
    [secureFetch, BASE_URL]
  );

  return { createPaymentIntent };
}
