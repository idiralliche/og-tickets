import React, { useContext } from 'react';
import { UserCartContext } from '../context/UserCartContext';

export default function OrderSummary({ onValidate }) {
  const { cart, totalCart } = useContext(UserCartContext);

  return (
    <div>
      <h2>Récapitulatif de la commande</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <strong>{item.offer.name}</strong> – {item.olympic_event.name}{' '}
            <br />
            Quantité&nbsp;: {item.quantity} x {item.offer.price}&nbsp;€ ={' '}
            <strong>{item.amount}&nbsp;€</strong>
          </li>
        ))}
      </ul>
      <div>
        <strong>Total à payer&nbsp;: {totalCart}&nbsp;€</strong>
      </div>
      <button className='button' onClick={onValidate}>
        Valider la commande
      </button>
    </div>
  );
}
