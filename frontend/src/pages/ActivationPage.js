import React from 'react';
import { useActivation } from '../hooks/useActivation';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivationResult from '../components/ActivationResult';
import Layout from '../components/layout/Layout';

const ActivationPage = () => {
  const navigate = useNavigate();
  const { status, email, resendLoading, handleResend } = useActivation();

  useEffect(() => {
    if (status === 'success') {
      navigate('/acces', { replace: true });
    }
  }, [status, navigate]);

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
