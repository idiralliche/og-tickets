import React, { useState, useEffect } from 'react';
import Offer from '../components/Offer';
import { getOffers } from '../services/offersService';
import ListItems from '../components/listItems/ListItems';

const Offers = ({ limit = null }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOffers()
      .then((data) => {
        setOffers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const offersToDisplay = limit ? offers.slice(0, limit) : offers;

  return (
    <ListItems
      items={offers}
      itemsLabel='offre'
      itemsClassName='offers'
      loading={loading}
      error={error}
    >
      {offersToDisplay.map((offer, index) => (
        <Offer key={index} offer={offer} />
      ))}
    </ListItems>
  );
};

export default Offers;
