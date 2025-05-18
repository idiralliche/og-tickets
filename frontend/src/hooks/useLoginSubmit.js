import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for handling login submission and post-login flow.
 *
 * @function
 * @param {Object} data - The response data from login API call
 * @returns {Function} A callback function that handles the login result
 *
 * @example
 * const onSubmit = useLoginSubmit();
 * onSubmit(loginResponse);
 *
 * @description
 * Handles both successful and failed login scenarios:
 * - On success: Stores access token, redirects to home, shows success notification
 * - On failure: Shows error notification
 * Uses AuthContext for authentication and NotificationContext for user feedback
 */
export default function useLoginSubmit(data) {
  const { login } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  return (data) => {
    if (data?.access) {
      login(data.access);
      navigate('/');
      showNotification('Connexion réussie !', 'success');
    } else {
      showNotification('Identifiants invalides.', 'error');
    }
  };
}
