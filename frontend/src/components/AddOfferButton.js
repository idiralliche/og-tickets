import React, { useContext } from 'react';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';
import { NotificationContext } from '../context/NotificationContext';
import { useCart } from '../hooks/useCart';

/**
 * Component representing a button to add an offer to the cart.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.offer - The offer to be added to the cart.
 * @param {string} props.offer.name - The name of the offer.
 * @param {Object} props.olympicEvent - The Olympic event associated with the offer.
 * @param {string} props.olympicEvent.name - The name of the Olympic event.
 */
const AddOfferButton = ({ offer, olympicEvent }) => {
  /**
   * Custom hook to access the cart context and add an offer to the cart.
   */
  const { addOffer } = useCart();

  /**
   * Context to show notifications.
   */
  const { showNotification } = useContext(NotificationContext);

  /**
   * Custom hook to handle the flash effect on button click.
   * @type {Array}
   */
  const [isFlashing, triggerFlash] = useFlashOnButtonClick(150);

  /**
   * Handles the click event to add the offer to the cart.
   */
  const handleAddToCart = () => {
    triggerFlash();
    addOffer({ offer: offer, olympic_event: olympicEvent });
    showNotification(
      `Une offre ${offer.name} ajoutée pour ${olympicEvent.name}`,
      'success'
    );
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`button ${isFlashing ? 'flash' : ''}`}
    >
      + {offer.name}
    </button>
  );
};

export default AddOfferButton;
