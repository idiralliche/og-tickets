import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for handling password reset confirmation and redirection.
 *
 * @function
 * @returns {Function} A callback function to execute after password reset confirmation
 *
 * @example
 * const onSubmit = usePasswordResetConfirmSubmit();
 * onSubmit(); // Will show success notification and redirect
 *
 * @description
 * Handles successful password reset scenario:
 * - Displays success notification
 * - Redirects to login/register page ('/acces')
 * Note: Designed to work with Djoser which returns 204 (no content)
 */
export default function usePasswordResetConfirmSubmit() {
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  return (data) => {
    // djoser renvoie 204 => serviceFunction renvoie null
    showNotification(
      'Votre mot de passe a été réinitialisé avec succès!',
      'success'
    );
    navigate('/acces'); // retour à la page de login/register
  };
}
