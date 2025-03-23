import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Offers from '../components/Offers';

const OffersPage = () => {
  return (
    <Layout
      title='Nos Offres'
      subtitle="Découvrez nos différentes offres adaptées à vos besoins pour profiter pleinement de l'événement."
      mainClassName='offers'
    >
      <h2>Liste des offres</h2>

      <div className='offers'>
        <div className='offers-container'>
          <Offers />
        </div>

        <div className='view-all'>
          <Link to='/panier' className='retry-button button'>
            Voir mon panier
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default OffersPage;
