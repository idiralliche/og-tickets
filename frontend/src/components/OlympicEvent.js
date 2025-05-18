import React from 'react';
import { Link } from 'react-router-dom';
import SportIcon from './SportIcon';

/**
 * Component that displays information about an Olympic event.
 * Shows sport details, event information, and provides navigation to offers.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.olympicEvent - The Olympic event data
 * @param {string} props.olympicEvent.sport - Name of the sport
 * @param {string} props.olympicEvent.name - Name of the specific event
 * @param {string} props.olympicEvent.description - Event description
 * @param {string} props.olympicEvent.date_time - ISO date string of the event
 * @param {string} props.olympicEvent.location - Venue location
 * @returns {JSX.Element} Card displaying event information with navigation link
 *
 * @example
 * <OlympicEvent olympicEvent={eventData} />
 *
 * @description
 * Features include:
 * - Sport icon display
 * - Formatted date/time
 * - Event details presentation
 * - Navigation link to offers
 * - All UI text in French
 * - Comprehensive test IDs for testing
 */
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

      <Link className='button' to='/offres' data-testid='link-see-offers'>
        Voir les offres
      </Link>
    </div>
  );
};

export default OlympicEvent;
