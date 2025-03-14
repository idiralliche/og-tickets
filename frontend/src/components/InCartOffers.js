import React, { useContext } from 'react';
import InCartOffer from './InCartOffer';
import { CartContext } from '../context/CartContext';

const InCartOffers = () => {
  const { cart, updateQuantity, removeOffer } = useContext(CartContext);

  const handleIncrement = (offerId) => {
    const item = cart.find((i) => i.offer.id === offerId);
    if (item) {
      updateQuantity(offerId, item.quantity + 1);
    }
  };

  const handleDecrement = (offerId) => {
    const item = cart.find((i) => i.offer.id === offerId);
    if (item && item.quantity > 0) {
      updateQuantity(offerId, item.quantity - 1);
    }
  };

  const handleQuantityChange = (offerId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (quantity === 0) {
      if (
        window.confirm('Voulez-vous vraiment supprimer cette offre du panier ?')
      ) {
        updateQuantity(offerId, 0);
      }
    } else {
      updateQuantity(offerId, quantity);
    }
  };

  return (
    <div className='in-cart-offers'>
      {cart.map((item) => (
        <InCartOffer
          key={item.offer.id}
          item={item}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onQuantityChange={handleQuantityChange}
          onRemove={removeOffer}
        />
      ))}
    </div>
  );
};

export default InCartOffers;
