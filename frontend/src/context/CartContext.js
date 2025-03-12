import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

/*
  This provider manages the cart state and persists it in localStorage.
*/
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load the cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Persist the cart in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addOffer = (offer) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.offer.id === offer.id);
      if (existingItem) {
        // Increment the quantity by 1
        return prevCart.map((item) =>
          item.offer.id === offer.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new offer with quantity 1
        return [...prevCart, { offer, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (offerId, quantity) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.offer.id === offerId ? { ...item, quantity } : item
        )
        // If the quantity is 0, the offer is removed from the cart
        .filter((item) => item.quantity > 0)
    );
  };

  const removeOffer = (offerId) => {
    setCart((prevCart) => prevCart.filter((item) => item.offer.id !== offerId));
  };

  const totalByOffer = (offerId) => {
    const item = cart.find((item) => item.offer.id === offerId);
    return item ? item.offer.price * item.quantity : 0;
  };

  const totalCart = cart.reduce(
    (total, item) => total + item.offer.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addOffer,
        updateQuantity,
        removeOffer,
        totalByOffer,
        totalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
