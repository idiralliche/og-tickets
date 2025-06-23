import React from 'react';
import { Link } from 'react-router-dom';

export default function OrderConfirmation({ order }) {
  if (!order) return <div>Aucune commande à afficher.</div>;
  return (
    <>
      <h2>Commande validée&nbsp;!</h2>
      <p>Merci pour votre commande.</p>
      {order.items.map((item) => (
        <div key={item.id} className='summary-container'>
          <div className='list-item'>
            <div>
              {item.quantity} x {item.offer.name} ({item.olympic_event.name}) :{' '}
              <strong>{item.amount}&nbsp;€</strong>
            </div>
          </div>
        </div>
      ))}
      <div>
        <strong>Total payé&nbsp;: {order.amount}&nbsp;€</strong>
        <br />
        Commandé le {new Date(order.created_at).toLocaleString('fr-FR')}
      </div>
      <div className='view-all'>
        <Link className='button cta' to='/'>
          Retour à l'accueil
        </Link>
      </div>
    </>
  );
}
