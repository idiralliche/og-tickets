import React from 'react';
import { Link } from 'react-router-dom';
import OlympicEvents from '../components/OlympicEvents';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout
      title='Bienvenue aux Jeux Olympiques 2024'
      subtitle='Les Jeux Olympiques de 2024 se dérouleront à Paris. Venez vivre des moments historiques en assistant aux plus grandes compétitions sportives mondiales.'
      mainClassName='olympic-events'
    >
      <h2>Les Épreuves</h2>

      <OlympicEvents limit={3} />

      <div className='view-all'>
        <Link
          to='/epreuves'
          data-testid='display-all-events'
          className='button'
        >
          Voir toutes les épreuves
        </Link>
      </div>
    </Layout>
  );
};

export default Home;
