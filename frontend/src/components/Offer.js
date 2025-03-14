import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';
import { useFlashOnButtonClick } from '../hooks/useFlashOnButtonClick';

const Offer = ({ offer }) => {
  const { name, description, price } = offer;
  const { addOffer } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);
  const [isFlashing, triggerFlash] = useFlashOnButtonClick(150);

  // Handler to add the offer to the cart
  const handleAddToCart = () => {
    triggerFlash();
    addOffer(offer);
    showNotification(` Une offre ${name} ajoutée à votre panier`, 'success');
  };

  return (
    <div className='offer-card' data-testid='offer'>
      <h3 data-testid='offer-heading'>{name}</h3>
      <p data-testid='offer-description'>{description}</p>
      <p data-testid='offer-price'>{price} €</p>
      <button
        className={`button ${isFlashing ? 'flash' : ''}`}
        onClick={handleAddToCart}
      >
        Ajouter au panier
      </button>
    </div>
  );
};

export default Offer;
