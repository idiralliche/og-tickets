import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import OlympicEvent from '../components/OlympicEvent';
import { getOlympicEvents } from '../services/olympicEventsService';

const OlympicEventsPage = () => {
  const [olympicEvents, setOlympicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOlympicEvents()
      .then((data) => {
        setOlympicEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Layout
      title='Toutes les épreuves des JO 2024'
      subtitle="Découvrez l'ensemble des épreuves programmées pour les Jeux Olympiques 2024. Explorez chaque discipline et préparez-vous à vivre des moments inoubliables."
      mainClassName='olympic-events'
    >
      <h2>Liste complète des épreuves</h2>

      {loading && (
        <div className='spinner-container' data-testid='loading'>
          <div className='spinner'></div>
          <p className='loading-text info-message'>
            Chargement des épreuves...
          </p>
        </div>
      )}

      {error && (
        <div className='error-container' data-testid='error'>
          <p className='error-message info-message'>
            ⚠️ Les épreuves n'ont pas pu être récupérées.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='button retry-button'
          >
            Réessayer
          </button>
        </div>
      )}

      {!loading && !error && olympicEvents.length === 0 && (
        <p data-testid='no-events' className='no-events info-message'>
          Aucune épreuve disponible.
        </p>
      )}

      {olympicEvents.map((olympicEvent) => (
        <OlympicEvent key={olympicEvent.pk} olympicEvent={olympicEvent} />
      ))}
    </Layout>
  );
};

export default OlympicEventsPage;
