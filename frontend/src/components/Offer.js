import React from 'react';
import { Link } from 'react-router-dom';

const Offer = ({ offer }) => {
  const { name, description, price } = offer;

  return (
    <div className='offer-card' data-testid='offer'>
      <h3 data-testid='offer-heading'>{name}</h3>
      <p data-testid='offer-description'>{description}</p>
      <p data-testid='offer-price'>{price} €</p>
      <Link to='/panier' className='button'>
        Ajouter au panier
      </Link>
    </div>
  );
};

export default Offer;
