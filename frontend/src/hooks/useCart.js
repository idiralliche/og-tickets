import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GuestCartContext } from '../context/GuestCartContext';
import { UserCartContext } from '../context/UserCartContext';

/**
 * Custom hook to access the appropriate cart context based on authentication status.
 * @function
 * @returns {Object} The cart context, either for a guest or an authenticated user.
 */
export function useCart() {
  /**
   * Context to check if the user is authenticated.
   * @type {boolean}
   */
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * Context for the guest cart.
   * @type {Object}
   */
  const guestCart = useContext(GuestCartContext);

  /**
   * Context for the user cart.
   * @type {Object}
   */
  const userCart = useContext(UserCartContext);

  /**
   * Return the appropriate cart context based on authentication status.
   */
  return isAuthenticated ? userCart : guestCart;
}
