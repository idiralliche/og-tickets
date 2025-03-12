import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Offer from '../components/Offer';
import { getOffers } from '../services/offersService';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffers()
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Layout
      title='Nos Offres'
      subtitle="Découvrez nos différentes offres adaptées à vos besoins pour profiter pleinement de l'événement."
      mainClassName='offers'
    >
      <h2>Liste des offres</h2>
      <div className='offers'>
        <div className='offers-container'>
          {loading && (
            <div className='spinner-container' data-testid='loading'>
              <div className='spinner'></div>
              <p className='loading-text'>Chargement des offres...</p>
            </div>
          )}
          {error && (
            <div className='error-container' data-testid='error'>
              <p className='error-message'>⚠️ {error}</p>
              <button
                onClick={() => window.location.reload()}
                className='retry-button'
              >
                Réessayer
              </button>
            </div>
          )}
          {!loading && !error && offers.length === 0 && (
            <p data-testid='no-offers' className='no-offers'>
              Aucune offre disponible.
            </p>
          )}
          {offers.map((offer, index) => (
            <Offer key={index} offer={offer} />
          ))}
        </div>
        <div className='view-all'>
          <Link to='/'>
            {' '}
            {/*Path vers le panier */}
            <button>Voir mon panier</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OffersPage;
