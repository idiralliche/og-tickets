import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getOffers } from '../services/offersService';
import Layout from '../components/layout/Layout';
import InCartOffers from '../components/InCartOffers';
import AddOfferButton from '../components/AddOfferButton';

const CartPage = () => {
  const { cart, totalCart } = useContext(CartContext);
  const [offersList, setOffersList] = useState([]);

  useEffect(() => {
    getOffers()
      .then((data) => {
        setOffersList(data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des offres:', error);
      });
  }, []);

  const availableOffers = offersList.filter(
    (offer) => !cart.some((item) => item.offer.id === offer.id)
  );

  return (
    <Layout
      title='Votre Panier'
      subtitle='Consultez le contenu de votre panier et ajoutez des offres pour profiter pleinement de l’événement.'
      mainClassName='cart-page'
    >
      <h2>Contenu du panier</h2>

      {cart.length === 0 ? (
        <p className='info-message'>Votre panier est vide.</p>
      ) : (
        <InCartOffers />
      )}

      <div className='cart-summary'>
        <div className='add-offer-text'>
          {availableOffers.length > 0 && 'Ajouter une offre :'}
        </div>
        <div className='add-offer-buttons'>
          {availableOffers.map((offer) => (
            <AddOfferButton key={offer.id} offer={offer} />
          ))}
        </div>
        {cart.length > 0 ? (
          <div className='cart-total'>Total : ${totalCart} €</div>
        ) : (
          <div className='view-all'>
            <Link to='/offres' className='button'>
              Voir les offres
            </Link>
          </div>
        )}
      </div>
      {cart.length > 0 && (
        <div className='order-button-container'>
          <button
            className='button order-button'
            disabled
            title='Créez un compte / connectez-vous, pour passer commande'
          >
            Passer la commande
          </button>
          <p className='info-message'>
            Vous devez être connecté pour passer commande.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
