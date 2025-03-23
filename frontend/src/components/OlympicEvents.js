import React, { useState, useEffect } from 'react';
import OlympicEvent from '../components/OlympicEvent';
import { getOlympicEvents } from '../services/olympicEventsService';
import ListItems from '../components/listItems/ListItems';

const OlympicEvents = ({ limit = null }) => {
  const [olympicEvents, setOlympicEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const olympicEventsToDisplay = limit
    ? olympicEvents.slice(0, limit)
    : olympicEvents;

  return (
    <ListItems
      items={olympicEvents}
      itemsLabel='offre'
      itemsClassName='events'
      loading={loading}
      error={error}
    >
      {olympicEventsToDisplay.map((olympicEvent, index) => (
        <OlympicEvent key={index} olympicEvent={olympicEvent} />
      ))}
    </ListItems>
  );
};

export default OlympicEvents;
