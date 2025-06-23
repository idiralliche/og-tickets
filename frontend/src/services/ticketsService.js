export async function getTickets(secureFetch) {
  const res = await secureFetch(
    `${process.env.REACT_APP_BACKEND_BASE_URL}api/tickets/`,
    {}
  );
  if (!res.ok) throw new Error('Erreur lors de la récupération des tickets.');
  return res.json();
}

export async function getTicketQRCode(secureFetch, ticketId) {
  const res = await secureFetch(
    `${process.env.REACT_APP_BACKEND_BASE_URL}api/tickets/${ticketId}/qr/`,
    {}
  );
  if (!res.ok) throw new Error('Erreur lors de la récupération du QR code.');
  return res.json();
}
