import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for handling password reset submission success.
 * Displays a notification confirming the reset link has been sent.
 *
 * @function
 * @returns {Function} A callback function that shows the success notification
 *
 * @example
 * const onSuccess = usePasswordResetSubmit();
 * onSuccess(); // Shows the password reset email confirmation
 *
 * @description
 * - Displays a French success notification about the reset link being sent
 * - Designed to be used after successful password reset request submission
 * - Uses NotificationContext for displaying user feedback
 */
export default function usePasswordResetSubmit() {
  const { showNotification } = useContext(NotificationContext);

  return (data) =>
    showNotification(
      'Un lien de réinitialisation de mot de passe vous a été envoyé. Vérifiez votre boîte email.',
      'success'
    );
}
