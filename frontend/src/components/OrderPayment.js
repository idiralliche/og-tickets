import React, { useEffect, useState, useContext } from 'react';
import { UserCartContext } from '../context/UserCartContext';
import { useStripePayment } from '../hooks/useStripePayment';
import { CardElement } from '@stripe/react-stripe-js';
import { useStripeSubmit } from '../hooks/useStripeSubmit';
import LoadingSpinner from './LoadingSpinner.js';

export default function OrderPayment({ onPaymentSuccess }) {
  const { totalCart, handleCheckout } = useContext(UserCartContext);
  const { createPaymentIntent } = useStripePayment();
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  // Crée un PaymentIntent au montage
  useEffect(() => {
    async function fetchIntent() {
      try {
        setLoading(true);
        const { clientSecret } = await createPaymentIntent(totalCart, 'eur');
        setClientSecret(clientSecret);
      } catch (err) {
        setError('Impossible d’initialiser le paiement Stripe.');
      } finally {
        setLoading(false);
      }
    }
    if (totalCart > 0) fetchIntent();
  }, [createPaymentIntent, totalCart]);

  const onSuccess = async (paymentIntent) => {
    setLoading(true);
    try {
      // Valider la commande backend (checkout)
      const order = await handleCheckout();
      onPaymentSuccess(order);
    } catch (err) {
      setError(
        "Le paiement a réussi mais l'enregistrement de la commande a échoué."
      );
    } finally {
      setLoading(false);
    }
  };

  const onError = (err) => setError(err.message || String(err));

  const handleSubmit = useStripeSubmit(clientSecret, onSuccess, onError);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className='error-container' data-testid='error'>
        <div className='error-message'>{error}</div>
      </div>
    );

  if (!clientSecret)
    return (
      <div>
        Préparation du paiement… <LoadingSpinner />
      </div>
    );

  return (
    <form className='card-form' onSubmit={handleSubmit}>
      <CardElement
        id='card-element'
        options={{
          style: {
            base: {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              color: '#002654',
              fontSize: '1.5rem',
              fontWeight: 500,
              fontFamily: 'Arial, sans-serif',
              backgroundColor: '#f5f5f5',
              '::placeholder': { color: '#3b006e' },
            },
            invalid: {
              color: '#d80a39',
            },
          },

          hidePostalCode: true,
        }}
        onChange={(event) => {
          setIsCardComplete(event.complete); // true si tous les champs sont valides
          if (event.error) setError(event.error.message);
          else setError('');
        }}
      />
      <button
        className='button'
        type='submit'
        disabled={loading || !isCardComplete}
      >
        Payer {totalCart}&nbsp;€
      </button>
    </form>
  );
}
