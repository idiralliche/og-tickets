import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.js';
import { GiPodiumWinner } from 'react-icons/gi';
import { TbBikeOff } from 'react-icons/tb';

/**
 * Displays account activation status with appropriate UI feedback.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - Activation status ('pending', 'success', or 'error')
 * @returns {JSX.Element|null} Conditional rendering based on status:
 *   - 'pending': Loading spinner
 *   - 'success': Success message with redirect indication
 *   - 'error': Error message with login page link
 *   - default: No rendering
 *
 * @example
 * <ActivationResult status="success" />
 *
 * @description
 * Provides visual feedback for account activation process:
 * - Uses icons to enhance message clarity
 * - Maintains all user-facing text in French
 * - Includes test IDs for testing purposes
 */
const ActivationResult = ({ status }) => {
  switch (status) {
    case 'pending':
      return <LoadingSpinner />;
    case 'success':
      return (
        <div className='success-container' data-testid='success'>
          <p className='success-message'>
            <GiPodiumWinner /> Votre compte est activé !<br />
            Vous allez être redirigé vers la page de connexion…
          </p>
        </div>
      );
    case 'error':
      return (
        <div className='error-container' data-testid='error'>
          <p className='error-message'>
            <TbBikeOff />
            Impossible d’activer le compte.
          </p>
          <Link to='/acces'>Retour à la page connexion</Link>
        </div>
      );
    default:
      return null;
  }
};

export default ActivationResult;
