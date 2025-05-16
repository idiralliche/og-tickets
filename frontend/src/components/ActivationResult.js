import React from 'react';
import { Link } from 'react-router-dom';

const ActivationResult = ({ status }) => {
  switch (status) {
    case 'pending':
      return <p>Activation en cours…</p>;
    case 'success':
      return (
        <p>
          ✅ Votre compte est activé !<br />
          Vous allez être redirigé vers la page de connexion…
        </p>
      );
    case 'error':
      return (
        <p>
          ❌ Impossible d’activer le compte.
          <br />
          <Link to='/acces'>Retour à la page d’accès</Link>
        </p>
      );
    default:
      return null;
  }
};

export default ActivationResult;
