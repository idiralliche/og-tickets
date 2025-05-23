import React from 'react';
import InCartOffer from './InCartOffer';
import { useCart } from '../hooks/useCart';

/**
 * Component representing a list of offers in the cart for a specific Olympic event.
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.olympicEventId - The ID of the Olympic event.
 */
const InCartOffersForOlympicEvent = ({ olympicEventId }) => {
  /**
   * Custom hook to access the cart context and its functions.
   * @type {Object}
   */
  const { cart, updateQuantity, removeOffer } = useCart();

  /**
   * Filtered items in the cart for the specific Olympic event.
   * @type {Array}
   */
  const items = cart.filter((i) => i.olympic_event.id === olympicEventId);

  // Return null if there are no items for the specific Olympic event
  if (items.length === 0) return null;

  return (
    <div className='in-cart-offers'>
      {items.map((item) => (
        <InCartOffer
          key={`${item.offer.id}-${olympicEventId}`}
          offer={item.offer}
          quantity={item.quantity}
          onIncrement={() =>
            updateQuantity(item.offer.id, item.quantity + 1, olympicEventId)
          }
          onDecrement={() =>
            updateQuantity(item.offer.id, item.quantity - 1, olympicEventId)
          }
          onQuantityChange={(id, qty) =>
            updateQuantity(item.offer.id, parseInt(qty, 10), olympicEventId)
          }
          onRemove={() => removeOffer(item.offer.id, olympicEventId)}
        />
      ))}
    </div>
  );
};

export default InCartOffersForOlympicEvent;
