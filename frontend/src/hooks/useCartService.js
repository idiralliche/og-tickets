import { useCallback } from 'react';
import { useSecureFetch } from './useSecureFetch';
import {
  newCartItemSchema,
  updateCartItemSchema,
} from '../validation/cartSchemas';

/**
 * Base URL for the cart API.
 * @constant {string}
 */
const BASE_URL = `${process.env.REACT_APP_BACKEND_BASE_URL}api/cart`;

/**
 * Custom hook to interact with the cart service.
 * @function
 * @returns {Object} An object containing functions to interact with the cart service.
 */
export const useCartService = () => {
  /**
   * Custom hook to make secure fetch requests.
   * @type {Function}
   */
  const secureFetch = useSecureFetch();

  /**
   * Function to get the current cart.
   * @returns {Promise<Object>} The current cart.
   */
  const getCurrentCart = useCallback(async () => {
    const res = await secureFetch(`${BASE_URL}/`, {});
    if (!res.ok) {
      throw new Error(
        `Erreur ${res.status} lors de la récupération du panier.`
      );
    }
    const data = await res.json();
    // Normally the API returns an array, but if you have configured a single open cart, take data[0]
    return Array.isArray(data) ? data[0] : data;
  }, [secureFetch]);

  /**
   * Function to get the items in the cart.
   * @returns {Promise<Array>} The items in the cart.
   */
  const getCartItems = useCallback(async () => {
    const res = await secureFetch(`${BASE_URL}/items/`, {});
    if (!res.ok) {
      throw new Error(
        `Erreur ${res.status} lors de la récupération des lignes du panier.`
      );
    }
    return res.json();
  }, [secureFetch]);

  /**
   * Function to add an item to the cart.
   * @param {Object} param - The item details.
   * @param {number} param.offer_id - The ID of the offer.
   * @param {number} param.olympic_event_id - The ID of the Olympic event.
   * @param {number} param.quantity - The quantity of the offer.
   * @param {number} param.amount - The total amount for the offer.
   * @returns {Promise<Object>} The added cart item.
   */
  const addCartItem = useCallback(
    async ({ offer_id, olympic_event_id, quantity, amount }) => {
      // validation
      await newCartItemSchema.validate({
        offer: offer_id,
        olympic_event: olympic_event_id,
        quantity,
        amount,
      });

      const res = await secureFetch(`${BASE_URL}/items/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id,
          olympic_event_id,
          quantity,
          amount,
        }),
      });
      if (!res.ok) {
        throw new Error(`Erreur ${res.status} lors de l’ajout au panier.`);
      }
      return res.json();
    },
    [secureFetch]
  );

  /**
   * Function to update an item in the cart.
   * @param {number} id - The ID of the cart item to update.
   * @param {Object} param - The updated item details.
   * @param {number} param.quantity - The new quantity of the offer.
   * @param {Object} param.offer - The offer details.
   * @param {Object} param.olympic_event - The Olympic event details.
   * @returns {Promise<Object>} The updated cart item.
   */
  const updateCartItem = useCallback(
    async (id, { quantity, offer, olympic_event }) => {
      // Get the IDs and price from offer/olympic_event
      if (!offer || !olympic_event) {
        throw new Error(
          'Impossible de modifier un item sans offer ni olympic_event.'
        );
      }
      const body = {
        quantity,
        offer_id: offer.id,
        olympic_event_id: olympic_event.id,
        amount: offer.price * quantity, // Always recalculate the amount
      };

      await updateCartItemSchema.validate(body);
      const res = await secureFetch(`${BASE_URL}/items/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error(
          `Erreur ${res.status} lors de la mise à jour du panier.`
        );
      }
      return res.json();
    },
    [secureFetch]
  );

  /**
   * Function to remove an item from the cart.
   * @param {number} id - The ID of the cart item to remove.
   */
  const removeCartItem = useCallback(
    async (id) => {
      const res = await secureFetch(`${BASE_URL}/items/${id}/`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error(
          `Erreur ${res.status} lors de la suppression du panier.`
        );
      }
    },
    [secureFetch]
  );

  /**
   * Function to checkout the cart.
   * @param {number} cartId - The ID of the cart to checkout.
   * @returns {Promise<Object>} The result of the checkout.
   */
  const checkoutCart = useCallback(
    async (cartId) => {
      const res = await secureFetch(`${BASE_URL}/${cartId}/checkout/`, {
        method: 'POST',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || `Erreur ${res.status} lors du checkout.`);
      }
      return res.json();
    },
    [secureFetch]
  );

  return {
    getCurrentCart,
    getCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    checkoutCart,
  };
};
