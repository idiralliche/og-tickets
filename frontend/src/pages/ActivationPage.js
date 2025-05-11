import React from 'react';
import { useActivation } from '../hooks/useActivation';
import ActivationResult from '../components/ActivationResult';
import Layout from '../components/layout/Layout';

const ActivationPage = () => {
  const { status, email, resendLoading, handleResend } = useActivation();

  return (
    <Layout title='Activation de compte' mainClassName='activation-page'>
      <ActivationResult status={status} />

      {status === 'error' && email && (
        <button
          className='button'
          onClick={handleResend}
          disabled={resendLoading}
          style={{ marginTop: '1rem' }}
        >
          {resendLoading
            ? 'Envoi en cours...'
            : 'Renvoyer le lien d’activation'}
        </button>
      )}
    </Layout>
  );
};

export default ActivationPage;
