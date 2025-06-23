import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';

export function TicketPdf({ ticket, qrDataUrl }) {
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.title}>Billet Olympique</Text>
        <Text>
          {ticket.olympic_event.sport} - {ticket.olympic_event.name}
        </Text>
        <Text>{ticket.olympic_event.description}</Text>
        <Text>Lieu : {ticket.olympic_event.location}</Text>
        <Text>
          Date :{' '}
          {new Date(ticket.olympic_event.date_time).toLocaleString('fr-FR')}
        </Text>
        <Text>
          Offre : {ticket.offer.name} ({ticket.nb_place} place(s))
        </Text>
        <View style={styles.qr}>
          <Image src={qrDataUrl} style={{ width: 180, height: 180 }} />
        </View>
        <Text style={styles.instructions}>
          Présentez ce code à l’entrée de l’événement. Ce billet est personnel.
        </Text>
      </Page>
    </Document>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 24,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  qr: {
    margin: '24px auto',
    alignItems: 'center',
  },
  instructions: {
    marginTop: 24,
    fontSize: 10,
    color: 'gray',
    textAlign: 'center',
  },
});
