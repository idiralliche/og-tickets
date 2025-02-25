import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import Epreuve from '../components/Epreuve';

const Home = () => {
  // Données simulées 
  const epreuves = [
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

      <div className="epreuves">
        <h2>Les Épreuves</h2>

        {epreuves.map((epreuve, index) => (
          <Epreuve
            key={index}
            titre={epreuve.titre}
            date={epreuve.date}
            lieu={epreuve.lieu}
            description={epreuve.description}
          />
        ))}

        <div className="view-all">
          <Link to="/epreuves">
            <button>Voir toutes les épreuves</button>
          </Link>
        </div>

      </div>

      <Footer />
    </div >
  );
};

export default Home;