import React, { useContext } from 'react';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';
import { CartContext } from '../context/CartContext';

const AddOfferButton = ({ offer }) => {
  const { addOffer } = useContext(CartContext);
  const [isFlashing, triggerFlash] = useFlashOnButtonClick(150);

  const handleMouseDown = () => {
    triggerFlash();
  };

  const handleMouseUp = () => {
    addOffer(offer);
  };

  return (
    <button
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`button ${isFlashing ? 'flash' : ''}`}
    >
      + {offer.name}
    </button>
  );
};

export default AddOfferButton;
