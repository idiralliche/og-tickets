import { useSecureFetch } from './useSecureFetch';
import { useState, useCallback } from 'react';

const BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL + 'api/tickets/';

export function useTickets() {
  const secureFetch = useSecureFetch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await secureFetch(BASE_URL, {});
      if (!res.ok) throw new Error('Erreur lors du chargement des billets');
      return await res.json();
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [secureFetch]);

  const fetchTicketQr = useCallback(
    async (ticketId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await secureFetch(`${BASE_URL}${ticketId}/qr/`, {});
        if (!res.ok)
          throw new Error('Erreur lors de la récupération du QRCode');
        return await res.json();
      } catch (e) {
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [secureFetch]
  );

  return { fetchTickets, fetchTicketQr, loading, error };
}
