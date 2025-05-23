import React, { useState, useEffect } from 'react';
import OlympicEvent from './OlympicEvent';
import { getOlympicEvents } from '../services/olympicEventsService';
import ListItems from './listItems/ListItems';

/**
 * Component representing a list of Olympic events.
 * @component
 * @param {Object} props - The component props.
 * @param {number|null} [props.limit=null] - The maximum number of Olympic events to display.
 */
const OlympicEvents = ({ limit = null }) => {
  /**
   * State to store the list of Olympic events.
   * @type {Array}
   */
  const [olympicEvents, setOlympicEvents] = useState([]);

  /**
   * State to track if the data is being loaded.
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);

  /**
   * State to store any error that occurs during data fetching.
   * @type {string|null}
   */
  const [error, setError] = useState(null);

  /**
   * Effect to fetch Olympic events data when the component mounts.
   */
  useEffect(() => {
    getOlympicEvents()
      .then((data) => {
        setOlympicEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  /**
   * Olympic events to display, limited if a limit prop is provided.
   * @type {Array}
   */
  const olympicEventsToDisplay = limit
    ? olympicEvents.slice(0, limit)
    : olympicEvents;

  return (
    <>
      <ListItems
        items={olympicEventsToDisplay}
        itemsLabel='épreuve'
        itemsClassName='events'
        loading={loading}
        error={error}
      >
        {olympicEventsToDisplay.map((olympicEvent, index) => (
          <OlympicEvent key={index} olympicEvent={olympicEvent} />
        ))}
      </ListItems>
    </>
  );
};

export default OlympicEvents;
