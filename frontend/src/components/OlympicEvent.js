import React, { useState, useEffect, useMemo } from 'react';
import SportIcon from './SportIcon';
import { useCartByOlympicEvent } from '../hooks/useCartByOlympicEvent';
import { getOffers } from '../services/offersService';
import InCartOffersForOlympicEvent from './InCartOffersForOlympicEvent.js';
import AddOfferButton from './AddOfferButton.js';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate.js';

/**
 * Component representing an Olympic event with its details and available offers.
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.olympicEvent - The Olympic event data.
 * @param {number} props.olympicEvent.id - The ID of the Olympic event.
 * @param {string} props.olympicEvent.sport - The sport of the Olympic event.
 * @param {string} props.olympicEvent.name - The name of the Olympic event.
 * @param {string} props.olympicEvent.description - The description of the Olympic event.
 * @param {string} props.olympicEvent.date_time - The date and time of the Olympic event.
 * @param {string} props.olympicEvent.location - The location of the Olympic event.
 */
const OlympicEvent = ({ olympicEvent }) => {
  /**
   * State to store the offers for the Olympic event.
   * @type {Array}
   */
  const [offers, setOffers] = useState([]);

  /**
   * Destructure the Olympic event data.
   */
  const { id, sport, name, description, date_time, location } = olympicEvent;

  /**
   * Custom hook to get cart items for the Olympic event.
   */
  const { olympicEvents } = useCartByOlympicEvent(id);

  /**
   * Get the first section of Olympic events or default to an empty section.
   * @type {Object}
   */
  const section = olympicEvents[0] || { items: [], total: 0 };

  /**
   * Memoized array of offer IDs in the cart.
   * @type {Array}
   */
  const offerIdsInCart = useMemo(
    () => section.items.map((item) => item.offer.id),
    [section.items]
  );

  /**
   * State to track if the event details are expanded.
   * @type {boolean}
   */
  const [expanded, setExpanded] = useState(false);

  /**
   * Memoized array of available offers not in the cart.
   * @type {Array}
   */
  const availableOffers = useMemo(
    () => offers.filter((o) => !offerIdsInCart.includes(o.id)),
    [offers, offerIdsInCart]
  );

  /**
   * Memoized formatted date string.
   * @type {string}
   */
  const formattedDate = useMemo(() => formatDate(date_time), [date_time]);

  /**
   * Effect to fetch offers when the component is expanded and offers are not already loaded.
   */
  useEffect(() => {
    if (expanded && offers.length === 0) {
      getOffers().then(setOffers);
    }
  }, [expanded, offers]);

  return (
    <div className='container' data-testid='olympic-event-container'>
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

        <button
          className='button'
          onClick={() => setExpanded((isExp) => !isExp)}
        >
          En Piste !{' '}
          <span>{expanded ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>
      </div>
      {expanded && (
        <div className='olympic-event-accordion'>
          <InCartOffersForOlympicEvent olympicEventId={id} />
          {availableOffers.length > 0 && (
            <div className='add-offer-section'>
              <p>Ajouter une offre :</p>
              <div className='add-offer-buttons'>
                {availableOffers.map((offer) => (
                  <AddOfferButton
                    key={offer.id}
                    offer={offer}
                    olympicEvent={olympicEvent}
                  />
                ))}
              </div>
            </div>
          )}
          <div className='view-all'>
            <Link to={'/panier'} className='button'>
              Voir le panier
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OlympicEvent;
