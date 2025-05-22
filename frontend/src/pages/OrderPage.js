import React, { useState } from 'react';
import OrderSummary from '../components/OrderSummary';
import OrderPayment from '../components/OrderPayment';
import OrderConfirmation from '../components/OrderConfirmation';
import Layout from '../components/layout/Layout';
import StripeWrapper from '../wrappers/StripeWrapper';

export default function OrderPage() {
  // step: 'summary' | 'payment' | 'confirmation'
  const [step, setStep] = useState('summary');
  const [orderData, setOrderData] = useState(null); // données de commande confirmée

  // Quand l'utilisateur clique sur "Valider la commande" dans OrderSummary
  const handleSummaryValidate = () => setStep('payment');

  // Quand Stripe a réussi, on appelle handlePaymentSuccess
  const handlePaymentSuccess = (data) => {
    setOrderData(data); // les infos de la commande
    setStep('confirmation');
  };

  return (
    <Layout
      title='Validation de la commande'
      subtitle='Entrez vos informations de paiement pour valider votre commande'
    >
      {step === 'summary' && (
        <OrderSummary onValidate={handleSummaryValidate} />
      )}
      {step === 'payment' && (
        <StripeWrapper>
          <OrderPayment onPaymentSuccess={handlePaymentSuccess} />
        </StripeWrapper>
      )}
      {step === 'confirmation' && <OrderConfirmation order={orderData} />}
    </Layout>
  );
}
