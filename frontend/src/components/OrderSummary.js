import React, { useContext } from 'react';
import { UserCartContext } from '../context/UserCartContext';

export default function OrderSummary({ onValidate }) {
  const { cart, totalCart } = useContext(UserCartContext);

  return (
    <>
      <h2>Récapitulatif de la commande</h2>
      {cart.map((item) => (
        <div key={item.id} className='summary-container'>
          <div className='list-item'>
            <div>
              Offre : <strong>{item.offer.name}</strong>
            </div>
            <div>
              Épreuve : {item.olympic_event.sport} - {item.olympic_event.name}
            </div>
            <div>
              Quantité&nbsp;: {item.quantity} x {item.offer.price}&nbsp;€ ={' '}
              <strong>{item.amount}&nbsp;€</strong>
            </div>
          </div>
        </div>
      ))}
      <div>
        <strong>Total à payer&nbsp;: {totalCart}&nbsp;€</strong>
      </div>
      <div className='view-all'>
        <button className='button cta' onClick={onValidate}>
          Valider la commande
        </button>
      </div>
    </>
  );
}
