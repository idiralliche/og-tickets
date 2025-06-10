import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation({ order }) {
  if (!order) return <div>Aucune commande à afficher.</div>;
  return (
    <div>
      <h2>Commande validée&nbsp;!</h2>
      <p>Merci pour votre commande.</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.quantity} x {item.offer.name} ({item.olympic_event.name}) :{' '}
            <strong>{item.amount}&nbsp;€</strong>
          </li>
        ))}
      </ul>
      <div>
        <strong>Total payé&nbsp;: {order.amount}&nbsp;€</strong>
        <br />
        Commandé le {new Date(order.created_at).toLocaleString('fr-FR')}
      </div>
      <Link className='button' to='/'>
        Retour à l'accueil
      </Link>
    </div>
  );
}
