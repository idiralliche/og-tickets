import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';

/**
 * Component representing an offer item in the shopping cart.
 * Handles quantity adjustment and removal with visual feedback.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - The cart item object
 * @param {Object} props.item.offer - The offer details
 * @param {string} props.item.offer.id - Unique identifier for the offer
 * @param {string} props.item.offer.name - Name of the offer
 * @param {number} props.item.offer.price - Price of the offer
 * @param {number} props.item.quantity - Current quantity in cart
 * @param {Function} props.onIncrement - Callback for increasing quantity
 * @param {Function} props.onDecrement - Callback for decreasing quantity
 * @param {Function} props.onQuantityChange - Callback for direct quantity input
 * @param {Function} props.onRemove - Callback for removing item from cart
 * @returns {JSX.Element} Cart item with quantity controls and removal option
 *
 * @example
 * <InCartOffer
 *   item={cartItem}
 *   onIncrement={handleIncrement}
 *   onDecrement={handleDecrement}
 *   onRemove={handleRemove}
 *   onQuantityChange={handleQuantityChange}
 * />
 *
 * @description
 * Features include:
 * - Visual feedback (flash) on button interactions
 * - Quantity adjustment via buttons or direct input
 * - Confirmation dialog before removal
 * - Real-time price calculation
 */
const InCartOffer = ({
  item,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onRemove,
}) => {
  // Flash effects for different buttons
  const [isFlashingPlus, triggerFlashPlus] = useFlashOnButtonClick(150);
  const [isFlashingMinus, triggerFlashMinus] = useFlashOnButtonClick(150);
  const [isFlashingTrash, triggerFlashTrash] = useFlashOnButtonClick(150);

  return (
    <div className='in-cart-offer' data-testid='in-cart-offer'>
      <div className='in-cart-offer-left'>
        <h3>{item.offer.name}</h3>
        <p>{item.offer.price} €</p>
      </div>
      <div className='in-cart-offer-middle'>
        <button
          onMouseDown={() => triggerFlashMinus()}
          onMouseUp={() => onDecrement(item.offer.id)}
          className={`button ${isFlashingMinus ? 'flash' : ''}`}
        >
          –
        </button>
        <input
          type='number'
          value={item.quantity}
          min='0'
          onChange={(e) => onQuantityChange(item.offer.id, e.target.value)}
        />
        <button
          onMouseDown={() => triggerFlashPlus()}
          onMouseUp={() => onIncrement(item.offer.id)}
          className={`button ${isFlashingPlus ? 'flash' : ''}`}
        >
          +
        </button>
      </div>
      <div className='in-cart-offer-right'>
        <p>{item.offer.price * item.quantity} €</p>
        <button
          onMouseDown={() => triggerFlashTrash()}
          onMouseUp={() => {
            if (
              window.confirm(
                'Voulez-vous vraiment supprimer cette offre du panier ?'
              )
            ) {
              onRemove(item.offer.id);
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
