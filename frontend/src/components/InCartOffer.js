import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';

/**
 * Component representing an offer in the cart with options to modify its quantity or remove it.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.offer - The offer data.
 * @param {string} props.offer.name - The name of the offer.
 * @param {string} [props.offer.description] - The description of the offer.
 * @param {number} props.offer.price - The price of the offer.
 * @param {number} props.quantity - The quantity of the offer in the cart.
 * @param {Function} props.onIncrement - Function to increment the quantity of the offer.
 * @param {Function} props.onDecrement - Function to decrement the quantity of the offer.
 * @param {Function} props.onQuantityChange - Function to change the quantity of the offer.
 * @param {Function} props.onRemove - Function to remove the offer from the cart.
 * @param {boolean} [props.showDescription=false] - Whether to show the offer description.
 */
const InCartOffer = ({
  offer,
  quantity,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onRemove,
  showDescription = false,
}) => {
  /**
   * Custom hook to handle the flash effect on the minus button click.
   * @type {Array}
   */
  const [isFlashingPlus, triggerFlashPlus] = useFlashOnButtonClick(150);

  /**
   * Custom hook to handle the flash effect on the plus button click.
   * @type {Array}
   */
  const [isFlashingMinus, triggerFlashMinus] = useFlashOnButtonClick(150);

  /**
   * Custom hook to handle the flash effect on the trash button click.
   * @type {Array}
   */
  const [isFlashingTrash, triggerFlashTrash] = useFlashOnButtonClick(150);

  return (
    <div className='in-cart-offer' data-testid='in-cart-offer'>
      <div className='in-cart-offer-left'>
        <h3>{offer.name}</h3>
        {showDescription && <p>{offer.description}</p>}
        <p>{offer.price} €</p>
      </div>
      <div className='in-cart-offer-middle'>
        <button
          onMouseDown={() => triggerFlashMinus()}
          onMouseUp={() => onDecrement(offer.id)}
          className={`button ${isFlashingMinus ? 'flash' : ''}`}
          disabled={quantity <= 1}
        >
          –
        </button>
        <input
          type='number'
          value={quantity}
          min='0'
          onChange={(e) => onQuantityChange(offer.id, e.target.value)}
        />
        <button
          onMouseDown={() => triggerFlashPlus()}
          onMouseUp={() => onIncrement(offer.id)}
          className={`button ${isFlashingPlus ? 'flash' : ''}`}
        >
          +
        </button>
      </div>
      <div className='in-cart-offer-right'>
        <p>{offer.price * quantity} €</p>
        <button
          onMouseDown={() => triggerFlashTrash()}
          onMouseUp={() => {
            if (
              window.confirm(
                'Voulez-vous vraiment supprimer cette offre du panier ?'
              )
            ) {
              onRemove(offer.id);
            }
          }}
          className='remove-button'
        >
          <FaTrash className={isFlashingTrash ? 'flash' : ''} />
        </button>
      </div>
    </div>
  );
};

export default InCartOffer;
