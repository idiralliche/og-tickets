import React, {
  useMemo,
  createContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

/**
 * Context for the guest cart.
 * @type {React.Context}
 */
export const GuestCartContext = createContext();

/**
 * Provider component for the guest cart context.
 * @component
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 */
export const GuestCartProvider = ({ children }) => {
  /**
   * State to store the cart items.
   * @type {Array}
   */
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  /**
   * Effect to save the cart to sessionStorage whenever it changes.
   */
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * Function to add an offer to the cart or increment its quantity if it already exists.
   * @param {Object} param - The offer and event details.
   * @param {Object} param.offer - The offer to add.
   * @param {Object} param.olympic_event - The Olympic event associated with the offer.
   * @param {number} [param.quantity=1] - The quantity of the offer to add.
   */
  const addOffer = useCallback(({ offer, olympic_event, quantity = 1 }) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.offer.id === offer.id && i.olympic_event.id === olympic_event.id
      );
      if (idx >= 0) {
        // Increment the quantity
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      } else {
        // Add a new offer
        return [...prev, { offer, olympic_event, quantity }];
      }
    });
  }, []);

  /**
   * Function to update the quantity of an offer in the cart.
   * @param {number} offerId - The ID of the offer to update.
   * @param {number} quantity - The new quantity of the offer.
   * @param {number} olympicEventId - The ID of the Olympic event associated with the offer.
   */
  const updateQuantity = useCallback((offerId, quantity, olympicEventId) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.offer.id === offerId && i.olympic_event.id === olympicEventId
            ? { ...i, quantity }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  /**
   * Function to remove an offer from the cart.
   * @param {number} offerId - The ID of the offer to remove.
   * @param {number} olympicEventId - The ID of the Olympic event associated with the offer.
   */
  const removeOffer = useCallback((offerId, olympicEventId) => {
    setCart((prev) =>
      prev.filter(
        (i) =>
          !(i.offer.id === offerId && i.olympic_event.id === olympicEventId)
      )
    );
  }, []);

  /**
   * Function to clear the cart.
   */
  const clearCart = useCallback(() => {
    setCart([]);
    sessionStorage.removeItem('cart');
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

  return (
    <GuestCartContext.Provider
      value={{
        cart,
        addOffer,
        updateQuantity,
        removeOffer,
        clearCart,
        totalCart,
      }}
    >
      {children}
    </GuestCartContext.Provider>
  );
};
