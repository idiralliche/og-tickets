import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OlympicEvent from '../components/OlympicEvent';
import { getOlympicEvents } from '../services/olympicEventsService';
import Layout from '../components/Layout';

const Home = () => {
  const [olympicEvents, setOlympicEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
      title='Bienvenue aux Jeux Olympiques 2024'
      subtitle='Les Jeux Olympiques de 2024 se dérouleront à Paris. Venez vivre des moments historiques en assistant aux plus grandes compétitions sportives mondiales.'
      mainClassName='olympic-events'
    >
      <h2>Les Épreuves</h2>

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
          <p className='error-message'>
            ⚠️ Les épreuves n'ont pas pu être récupérées.
          </p>
          <button
            onClick={() => window.location.reload()}
            className='button retry- button'
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
      {/* Display only the first 3 olympic events */}
      {olympicEvents.slice(0, 3).map((olympicEvent) => (
        <OlympicEvent key={olympicEvent.pk} olympicEvent={olympicEvent} />
      ))}

      {/* Render "view all events" button only if at least one event is loaded */}
      {olympicEvents.length > 0 && (
        <div className='view-all'>
          <Link
            to='/epreuves'
            data-testid='display-all-events'
            className='button'
          >
            Voir toutes les épreuves
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Home;
