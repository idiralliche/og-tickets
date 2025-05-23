import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useCallback } from 'react';

export function useStripeSubmit(clientSecret, onSuccess, onError) {
  const stripe = useStripe();
  const elements = useElements();

  return useCallback(
    async (e) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      const cardElement = elements.getElement('card');
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );
      if (error) onError(error);
      else if (paymentIntent && paymentIntent.status === 'succeeded')
        onSuccess(paymentIntent);
      else onError(new Error('Le paiement n’a pas été validé.'));
    },
    [stripe, elements, clientSecret, onSuccess, onError]
  );
}
