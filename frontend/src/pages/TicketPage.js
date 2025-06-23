import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTickets } from '../hooks/useTickets.js';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TicketPdf } from '../components/TicketPdf';
import { generateQrDataUrl } from '../utils/qr';

export default function TicketPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(location.state?.ticket || null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [loading, setLoading] = useState(!ticket);
  const { fetchTickets, fetchTicketQr } = useTickets();

  useEffect(() => {
    async function loadTicket() {
      if (!ticket) {
        try {
          const tickets = await fetchTickets();
          const found = tickets.find((t) => t.id === id);
          if (!found) {
            navigate('/loge');
            return;
          }
          setTicket(found);
        } catch {
          navigate('/loge');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    loadTicket();
    // eslint-disable-next-line
  }, [id, ticket, fetchTickets, navigate]);

  useEffect(() => {
    if (ticket) {
      fetchTicketQr(ticket.id)
        .then((data) => {
          return generateQrDataUrl({
            ticket_id: data.ticket_id,
            hmac: data.hmac,
          });
        })
        .then(setQrDataUrl)
        .catch(() => {});
    }
  }, [ticket, fetchTicketQr]);

  return (
    <Layout
      title='Votre billet'
      subtitle={`Billet pour ${ticket.olympic_event.sport} - ${ticket.olympic_event.name}`}
      mainClassName='summary-page'
    >
      <Link to='/loge'>← Retour à mes billets</Link>
      {loading ? (
        <LoadingSpinner />
      ) : !ticket ? (
        <div className='error-container' data-testid='error'>
          <p className='error-message'>Billet non trouvé.</p>
        </div>
      ) : (
        <div id='ticket-to-print' className='summary-container'>
          <div className='list-item'>
            <h2>
              {ticket.olympic_event.sport} - {ticket.olympic_event.name}
            </h2>
            <div>
              <span className='bold'>Description :</span>{' '}
              {ticket.olympic_event.description}
            </div>
            <div>
              <span className='bold'>Date de l'événement :</span>{' '}
              {new Date(ticket.olympic_event.date_time).toLocaleString('fr-FR')}
            </div>
            <div>
              <span className='bold'>Lieu :</span>{' '}
              {ticket.olympic_event.location}
            </div>
            <div>
              <span className='bold'>Offre :</span> {ticket.offer.name}
            </div>
            <div>
              <span className='bold'>Nombre de places :</span> {ticket.nb_place}
            </div>
            <div className='qr-code-container'>
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt='QR code billet olympique'
                  style={{ width: 200, height: 200 }}
                />
              )}
            </div>
            {qrDataUrl && (
              <PDFDownloadLink
                document={<TicketPdf ticket={ticket} qrDataUrl={qrDataUrl} />}
                fileName={`billet_olympique_${ticket.olympic_event.name}.pdf`}
                className='button'
              >
                Télécharger le billet PDF
              </PDFDownloadLink>
            )}
            <div className='instructions'>
              Présentez ce code à l’entrée de l’événement. Ce billet est
              personnel.
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
