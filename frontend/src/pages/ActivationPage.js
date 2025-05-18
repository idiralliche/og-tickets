import React from 'react';
import Layout from '../components/layout/Layout';
import ActivationResult from '../components/ActivationResult';
import { useActivation } from '../hooks/useActivation';

export default function ActivationPage() {
  const status = useActivation();

  return (
    <Layout title='Activation de compte' mainClassName='basic-page'>
      <div className='container'>
        <ActivationResult status={status} />
      </div>
    </Layout>
  );
}
