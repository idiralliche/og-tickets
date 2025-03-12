import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { getOffers } from '../services/offersService';
import Layout from '../components/Layout';

const CartPage = () => {
  const {
    cart,
    addOffer,
    updateQuantity,
    removeOffer,
    totalCart,
    totalByOffer,
  } = useContext(CartContext);
  const [offersList, setOffersList] = useState([]);
  const [selectedOfferId, setSelectedOfferId] = useState('');

  // Fetch available offers on mount
  useEffect(() => {
    getOffers()
      .then((data) => {
        setOffersList(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des offres:', error);
      });
  }, []);

  // Handler pour le formulaire d'ajout d'une offre via dropdown
  const handleAddOffer = (e) => {
    e.preventDefault();
    if (!selectedOfferId) return;
    const offerToAdd = offersList.find(
      (offer) => String(offer.id) === selectedOfferId
    );
    if (offerToAdd) {
      addOffer(offerToAdd);
      setSelectedOfferId('');
    }
  };

  // Handler pour modification de la quantité par input
  const handleQuantityChange = (offerId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity < 0) return;
    updateQuantity(offerId, quantity);
  };

  return (
    <Layout
      title='Votre Panier'
      subtitle='Consultez le contenu de votre panier et ajoutez des offres.'
      mainClassName='cart-page'
    >
      <h2>Contenu du panier</h2>

      {cart.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <table className='cart-table'>
          <thead>
            <tr>
              <th>Offre</th>
              <th>Prix unitaire</th>
              <th>Quantité</th>
              <th>Total par offre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.offer.id}>
                <td>{item.offer.name}</td>
                <td>{item.offer.price} €</td>
                <td>
                  <input
                    type='number'
                    min='0'
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.offer.id, e.target.value)
                    }
                  />
                </td>
                <td>{totalByOffer(item.offer.id)} €</td>
                <td>
                  <button
                    className='button'
                    onClick={() => removeOffer(item.offer.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className='cart-total'>
        <h3>Total du panier : {totalCart} €</h3>
      </div>

      <hr />

      <h2>Ajouter une offre au panier</h2>
      <form onSubmit={handleAddOffer}>
        <select
          value={selectedOfferId}
          onChange={(e) => setSelectedOfferId(e.target.value)}
        >
          <option value=''>-- Sélectionnez une offre --</option>
          {offersList.map((offer) => (
            <option key={offer.id} value={offer.id}>
              {offer.name} - {offer.price} €
            </option>
          ))}
        </select>
        <button className='button' type='submit'>
          Ajouter l'offre
        </button>
      </form>
    </Layout>
  );
};

export default CartPage;
