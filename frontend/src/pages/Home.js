import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import OlympicEvent from '../components/OlympicEvent';

const Home = () => {
  const olympicEvents = [
    {
      model: "contests.contest",
      pk: 1,
      fields: {
        sport: "Basketball",
        name: "Hommes, phase de groupe",
        description: "groupe C, Jeu 19",
        date_time: "2024-07-31T17:15:00Z",
        location: "Stade Pierre Mauroy"
      }
    },
    {
      model: "contests.contest",
      pk: 2,
      fields: {
        sport: "Judo",
        name: "-48 kg - fem., éliminatoire",
        description: "1/16 finale, Concours 1",
        date_time: "2024-07-27T10:00:00Z",
        location: "Champ de Mars Arena"
      }
    },
    {
      model: "contests.contest",
      pk: 3,
      fields: {
        sport: "Volleyball",
        name: "Femmes, tour préliminaire",
        description: "Poule B Match 8",
        date_time: "2024-07-27T18:00:00Z",
        location: "Tour Eiffel - terrain central"
      }
    },
    {
      model: "contests.contest",
      pk: 4,
      fields: {
        sport: "Football",
        name: "Hommes, éliminatoires",
        description: "groupe B - Match 3",
        date_time: "2024-07-24T15:00:00Z",
        location: "Geoffroy-Guichard, St-Etienne"
      }
    },
    {
      model: "contests.contest",
      pk: 5,
      fields: {
        sport: "Natation",
        name: "400m 4 nages femmes",
        description: "Phases éliminatoires Groupe 1. Les huit meilleurs temps se qualifient en finale.",
        date_time: "2024-07-29T11:00:00Z",
        location: "Paris La Defense Arena"
      }
    }
  ];

  return (
    <div>
      <Header />
      <h1>Bienvenue aux Jeux Olympiques 2024</h1>
      <p className="home-desc">
        Les Jeux Olympiques de 2024 se dérouleront à Paris.<br />
        Venez vivre des moments historiques en assistant aux plus grandes compétitions sportives mondiales.
      </p>

      <div className="olympic-events">
        <h2>Les Épreuves</h2>

        {olympicEvents.map((olympicEvent) => (
          <OlympicEvent key={olympicEvent.pk} olympicEvent={olympicEvent} />
        ))}

        <div className="view-all">
          <Link to="/olympicEvents">
            <button>Voir toutes les épreuves</button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
