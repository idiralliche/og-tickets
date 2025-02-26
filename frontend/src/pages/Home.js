import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import OlympicEvent from '../components/OlympicEvent';

const Home = () => {
  // Données simulées 
  const olympicEvents = [
    { titre: "Athlétisme - 100m", date: "26 juillet 2024", lieu: "Stade Olympique", description: "Série éliminatoire messieurs, groupe 1" },
    { titre: "Athlétisme - 200m", date: "27 juillet 2024", lieu: "Stade Olympique", description: "Demi-finale dames, groupe 1" },
    { titre: "Relais 4x100m", date: "28 juillet 2024", lieu: "Stade Olympique", description: "Finale hommes" }
  ];

  return (
    <div>
      <Header />
      <h1>Bienvenue aux Jeux Olympiques 2024</h1>
      <p className='home_desc'>Les Jeux Olympiques de 2024 se dérouleront à Paris.<br />
        Venez vivre des moments historiques en assistant aux plus grandes compétitions sportives mondiales.</p>

      <div className="olympicEvents">
        <h2>Les Épreuves</h2>

        {olympicEvents.map((olympicEvent, index) => (
          <OlympicEvent
            key={index}
            titre={olympicEvent.titre}
            date={olympicEvent.date}
            lieu={olympicEvent.lieu}
            description={olympicEvent.description}
          />
        ))}

        <div className="view-all">
          <Link to="/olympicEvents">
            <button>Voir toutes les épreuves</button>
          </Link>
        </div>

      </div>

      <Footer />
    </div >
  );
};

export default Home;