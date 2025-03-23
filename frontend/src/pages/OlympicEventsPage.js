import React from 'react';
import Layout from '../components/layout/Layout';
import OlympicEvents from '../components/OlympicEvents';

const OlympicEventsPage = () => {
  return (
    <Layout
      title='Toutes les épreuves des JO 2024'
      subtitle="Découvrez l'ensemble des épreuves programmées pour les Jeux Olympiques 2024. Explorez chaque discipline et préparez-vous à vivre des moments inoubliables."
      mainClassName='olympic-events'
    >
      <h2>Liste complète des épreuves</h2>

      <OlympicEvents />
    </Layout>
  );
};

export default OlympicEventsPage;
