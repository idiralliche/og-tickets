import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTickets } from '../hooks/useTickets.js';
import LoadError from './listItems/LoadError.js';
import LoadingSpinner from './LoadingSpinner.js';

const TicketsList = () => {
  const { fetchTickets, loading, error } = useTickets();
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetchTickets().then((data) => {
      if (isMounted) setTickets(data);
    });
    return () => {
      isMounted = false;
    };
  }, [fetchTickets]);

  if (loading) return <LoadingSpinner />;
  if (error) return <LoadError itemsLabel={'ticket'} />;
  if (!tickets.length) return <p>Vous n’avez aucun ticket pour le moment.</p>;

  return (
    <>
      <h2>Mes billets</h2>
      {tickets.map((ticket) => (
        <div className='summary-container'>
          <div key={ticket.id} className='list-item'>
            <h3 data-testid='olympic-event-heading'>
              {ticket.olympic_event?.sport}
            </h3>
            <div>
              Statut du ticket :{' '}
              <span
                className={
                  'status ' + (ticket.status === 'valid' ? 'valid' : 'invalid')
                }
              >
                {ticket.status === 'valid' ? 'Valide' : 'Utilisé'}
              </span>
            </div>
            <div>
              Épreuve : <span>{ticket.olympic_event?.name}</span>
            </div>
            <div>
              Offre : <span>{ticket.offer?.name}</span> —{' '}
              <span>
                {ticket.nb_place} place{ticket.nb_place > 1 ? 's' : ''}
              </span>
            </div>
            <div>Prix : {ticket.price} €</div>
            <div>
              Achat :{' '}
              {ticket.created_at &&
                new Date(ticket.created_at).toLocaleString('fr-FR')}
            </div>

            {ticket.status === 'valid' && (
              <button
                className='button'
                onClick={() =>
                  navigate(`/tickets/${ticket.id}`, { state: { ticket } })
                }
              >
                Voir le ticket
              </button>
            )}
            {ticket.status === 'used' && (
              <span style={{ color: 'crimson', fontWeight: 'bold' }}>
                Billet déjà utilisé
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default TicketsList;
