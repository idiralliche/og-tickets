import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

/**
 * Custom hook for handling successful user registration.
 * Displays a success notification prompting email verification.
 *
 * @function
 * @returns {Function} A callback function that shows registration success notification
 *
 * @example
 * const onRegisterSuccess = useRegisterSubmit();
 * onRegisterSuccess(); // Shows "Inscription réussie ! Vérifiez votre email."
 *
 * @description
 * - Displays a French success notification about registration
 * - Intended to be used after successful account creation
 * - Assumes email verification is required (common in registration flows)
 * - Uses NotificationContext for user feedback
 */
export default function useRegisterSubmit() {
  const { showNotification } = useContext(NotificationContext);

  return (data) =>
    showNotification('Inscription réussie ! Vérifiez votre email.', 'success');
}
