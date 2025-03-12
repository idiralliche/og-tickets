import React from 'react';
import SportIcon from './SportIcon';

const OlympicEvent = ({ olympicEvent }) => {
  const { sport, name, description, date_time, location } = olympicEvent;
  const formattedDate = new Date(date_time).toLocaleString('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className='olympic-event' data-testid='olympic-event'>
      <h3 data-testid='olympic-event-heading'>
        <SportIcon sport={sport} /> {sport}
      </h3>

      <div className='details' data-testid='olympic-event-details'>
        <p>
          <strong>Date :</strong> {formattedDate}
        </p>
        <p>
          <strong>Lieu :</strong> {location}
        </p>
      </div>

      <div className='description' data-testid='olympic-event-description'>
        <p>
          <strong>{name}</strong>
        </p>
        <p>{description}</p>
      </div>

      <button>Réserver</button>
    </div>
  );
};

export default OlympicEvent;
