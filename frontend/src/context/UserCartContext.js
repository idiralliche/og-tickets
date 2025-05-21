import React, {
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import { useCartService } from '../hooks/useCartService';
import { NotificationContext } from './NotificationContext';
import { AuthContext } from './AuthContext';

/**
 * Context for the user cart.
 * @type {React.Context}
 */
export const UserCartContext = createContext();

/**
 * Provider component for the user cart context.
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 */
export const UserCartProvider = ({ children }) => {
  /**
   * Context to check if the user is authenticated.
   * @type {boolean}
   */
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * Custom hook to access cart service functions.
   * @type {Object}
   */
  const {
    getCurrentCart,
    getCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    checkoutCart,
  } = useCartService();

  /**
   * Context to show notifications.
   * @type {Function}
   */
  const { showNotification } = useContext(NotificationContext);

  /**
   * State to store the cart items.
   * @type {Array}
   */
  const [cart, setCart] = useState([]);

  /**
   * State to store the cart metadata.
   * @type {Object|null}
   */
  const [cartMeta, setCartMeta] = useState(null);

  /**
   * Effect to load the cart from the server when the user is authenticated.
   */
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentCart()
        .then((meta) => {
          setCartMeta(meta);
          return getCartItems();
        })
        .then((items) => setCart(items))
        .catch((e) => {
          console.error('Failed to load cart:', e);
          showNotification(
            'Erreur lors du chargement du panier',
            'error',
            3000
          );
        });
    } else {
      setCart([]);
      setCartMeta(null);
    }
  }, [isAuthenticated]);

  /**
   * Function to add an offer to the cart or increment its quantity if it already exists.
   * @param {Object} param - The offer and event details.
   * @param {Object} param.offer - The offer to add.
   * @param {Object} param.olympic_event - The Olympic event associated with the offer.
   * @param {number} [param.quantity=1] - The quantity of the offer to add.
   */
  const addOffer = useCallback(
    async ({ offer, olympic_event, quantity = 1 }) => {
      try {
        const found = cart.find(
          (i) =>
            i.offer.id === offer.id && i.olympic_event.id === olympic_event.id
        );

        if (found) {
          await updateCartItem(found.id, {
            quantity: found.quantity + quantity,
            offer: found.offer,
            olympic_event: found.olympic_event,
          });
          setCart((prev) =>
            prev.map((i) =>
              i.id === found.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          );
        } else {
          const newItem = await addCartItem({
            offer_id: offer.id,
            olympic_event_id: olympic_event.id,
            quantity,
            amount: offer.price * quantity,
          });
          setCart((prev) => [...prev, newItem]);
        }
      } catch (e) {
        showNotification('Échec de la modification du panier', 'error', 3000);
      }
    },
    [cart, addCartItem, updateCartItem, showNotification]
  );

  /**
   * Function to update the quantity of an offer in the cart.
   * @param {number} offerId - The ID of the offer to update.
   * @param {number} quantity - The new quantity of the offer.
   * @param {number} olympicEventId - The ID of the Olympic event associated with the offer.
   */
  const updateQuantity = useCallback(
    async (offerId, quantity, olympicEventId) => {
      const found = cart.find(
        (i) => i.offer.id === offerId && i.olympic_event.id === olympicEventId
      );
      if (!found) return;
      if (quantity === 0) {
        await removeCartItem(found.id);
        setCart((prev) => prev.filter((i) => i.id !== found.id));
      } else {
        const updatedItem = await updateCartItem(found.id, {
          quantity,
          offer: found.offer,
          olympic_event: found.olympic_event,
        });
        setCart((prev) =>
          prev.map((i) => (i.id === found.id ? updatedItem : i))
        );
      }
    },
    [cart, updateCartItem, removeCartItem]
  );

  /**
   * Function to remove an offer from the cart.
   * @param {number} offerId - The ID of the offer to remove.
   * @param {number} olympicEventId - The ID of the Olympic event associated with the offer.
   */
  const removeOffer = useCallback(
    async (offerId, olympicEventId) => {
      const found = cart.find(
        (i) => i.offer.id === offerId && i.olympic_event.id === olympicEventId
      );
      if (found) {
        await removeCartItem(found.id);
        setCart((prev) => prev.filter((i) => i.id !== found.id));
      }
    },
    [cart, removeCartItem]
  );

  /**
   * Function to clear the cart.
   */
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * Memoized total price of the cart.
   * @type {number}
   */
  const totalCart = useMemo(
    () =>
      cart.reduce((total, item) => total + item.offer.price * item.quantity, 0),
    [cart]
  );

  /**
   * Function to handle the checkout process.
   */
  const handleCheckout = async () => {
    if (!cartMeta?.id) return;
    try {
      const result = await checkoutCart(cartMeta.id);
      setCartMeta(result);
      setCart([]); // New cart
      showNotification('Commande validée !', 'success', 3000);
    } catch (e) {
      console.error(e);
      showNotification(e.message, 'error');
    }
  };

  /**
   * Function to refresh the cart from the server.
   */
  const refreshCart = useCallback(() => {
    if (isAuthenticated) {
      getCurrentCart()
        .then((meta) => {
          setCartMeta(meta);
          return getCartItems();
        })
        .then((items) => setCart(items))
        .catch((e) => {
          console.error('Failed to reload cart:', e);
          showNotification(
            'Erreur lors du rechargement du panier',
            'error',
            5000
          );
        });
    }
  }, [isAuthenticated, getCurrentCart, getCartItems, showNotification]);

  return (
    <UserCartContext.Provider
      value={{
        cart,
        cartMeta,
        addOffer,
        updateQuantity,
        removeOffer,
        clearCart,
        totalCart,
        handleCheckout,
        refreshCart,
      }}
    >
      {children}
    </UserCartContext.Provider>
  );
};
