import { useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { GuestCartContext } from '../context/GuestCartContext';
import { useCartService } from '../hooks/useCartService';
import { UserCartContext } from '../context/UserCartContext';
import { extractId } from '../utils/utils';

/**
 * Custom hook to merge the guest cart into the user cart upon login.
 * @function
 */
export function useCartSyncOnLogin() {
  /**
   * Context to check if the user is authenticated.
   * @type {boolean}
   */
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * Context to access the guest cart and its functions.
   * @type {Object}
   */
  const { cart: guestCart, clearCart: clearGuestCart } =
    useContext(GuestCartContext);

  /**
   * Custom hook to access cart service functions.
   * @type {Object}
   */
  const { getCartItems, updateCartItem, addCartItem } = useCartService();

  /**
   * Context to refresh the user cart.
   * @type {Function}
   */
  const { refreshCart } = useContext(UserCartContext);

  /**
   * Ref to track if the guest cart has already been imported.
   * @type {React.RefObject<boolean>}
   */
  const alreadyImported = useRef(false);

  /**
   * Effect to merge the guest cart into the user cart upon login.
   */
  useEffect(() => {
    if (isAuthenticated && guestCart.length > 0 && !alreadyImported.current) {
      alreadyImported.current = true;

      (async () => {
        // Get the updated user cart from the backend
        let userCartItems = await getCartItems();

        for (const guestItem of guestCart) {
          if (!guestItem || !guestItem.offer || !guestItem.olympic_event)
            continue;
          const guestOfferId = extractId(guestItem.offer);
          const guestOlympicEventId = extractId(guestItem.olympic_event);

          const match = userCartItems.find(
            (i) =>
              extractId(i.offer) === guestOfferId &&
              extractId(i.olympic_event) === guestOlympicEventId
          );

          try {
            if (match && match.offer && match.olympic_event) {
              const nouvelleQuantite = match.quantity + guestItem.quantity;
              // PATCH
              await updateCartItem(match.id, {
                quantity: nouvelleQuantite,
                offer: match.offer,
                olympic_event: match.olympic_event,
                amount: match.amount,
              });
            } else {
              // POST
              await addCartItem({
                offer_id: extractId(guestItem.offer),
                olympic_event_id: extractId(guestItem.olympic_event),
                quantity: guestItem.quantity,
                amount:
                  guestItem.amount ??
                  (guestItem.offer.price
                    ? guestItem.offer.price * guestItem.quantity
                    : undefined),
              });
            }
          } catch (e) {
            // Log but continue the merge
            console.error('Erreur lors de la fusion du panier :', e);
          }
        }
        clearGuestCart();
        refreshCart();
      })();
    }
    if (!isAuthenticated) {
      alreadyImported.current = false;
    }
    // eslint-disable-next-line
  }, [isAuthenticated, guestCart]);
}
