import { useMemo } from 'react';
import { useCart } from '../hooks/useCart';

/**
 * Custom hook to filter and summarize cart items by Olympic event.
 * @function
 * @param {number|null} [olympicEventId=null] - The ID of the Olympic event to filter by.
 * @returns {Object} An object containing the filtered Olympic events and the total cart price.
 * @returns {Array} returns.olympicEvents - The filtered Olympic events with their items and subtotals.
 * @returns {number} returns.cartTotal - The total price of the cart.
 */
export const useCartByOlympicEvent = (olympicEventId = null) => {
  /**
   * Custom hook to access the cart context.
   * @type {Object}
   */
  const { cart } = useCart();

  /**
   * Memoized function to filter and summarize cart items by Olympic event.
   * @type {Object}
   */
  const { olympicEvents, cartTotal } = useMemo(() => {
    /**
     * Map to store Olympic events and their items.
     * @type {Map}
     */
    const olympicEventsMap = new Map();

    /**
     * Total price of all items in the cart.
     * @type {number}
     */
    let totalAll = 0;

    /**
     * Iterate over each item in the cart.
     */
    for (const item of cart) {
      if (!item.olympic_event) continue;
      const eventId = item.olympic_event.id;

      // Filter by the specified Olympic event ID if provided
      if (olympicEventId && olympicEventId !== eventId) continue;

      if (!olympicEventsMap.has(eventId)) {
        olympicEventsMap.set(eventId, {
          olympicEvent: item.olympic_event,
          items: [],
          total: 0,
        });
      }
      const olpEvt = olympicEventsMap.get(eventId);
      olpEvt.items.push(item);
      const subTotal = item.offer.price * item.quantity;
      olpEvt.total += subTotal;
      totalAll += subTotal;
    }

    return {
      olympicEvents: Array.from(olympicEventsMap.values()),
      cartTotal: totalAll,
    };
  }, [cart, olympicEventId]);

  return { olympicEvents, cartTotal };
};
