import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { NotificationContext } from '../context/NotificationContext';

const Offer = ({ offer }) => {
  const { name, description, price } = offer;
  const { addOffer } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);

  // Handler to add the offer to the cart without navigation
  const handleAddToCart = () => {
    addOffer(offer);
    showNotification(` Une offre ${name} ajoutée à votre panier`, 'success');
  };

  return (
    <div className='offer-card' data-testid='offer'>
      <h3 data-testid='offer-heading'>{name}</h3>
      <p data-testid='offer-description'>{description}</p>
      <p data-testid='offer-price'>{price} €</p>
      <button className='button' onClick={handleAddToCart}>
        Ajouter au panier
      </button>
    </div>
  );
};

export default Offer;
