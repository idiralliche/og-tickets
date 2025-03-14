import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';

const InCartOffer = ({
  item,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onRemove,
}) => {
  const [isFlashingPlus, triggerFlashPlus] = useFlashOnButtonClick(150);
  const [isFlashingMinus, triggerFlashMinus] = useFlashOnButtonClick(150);
  const [isFlashingTrash, triggerFlashTrash] = useFlashOnButtonClick(150);

  return (
    <div className='in-cart-offer'>
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
