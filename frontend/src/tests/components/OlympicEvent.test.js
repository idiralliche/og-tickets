import React from 'react';
import { render, screen } from '@testing-library/react';
import OlympicEvent from '../../components/OlympicEvent';

describe('OlympicEvent component', () => {
    const olympicEvent = {
        model: 'contests.contest',
        pk: 1,
        fields: {
            sport: 'Basketball',
            name: "Hommes, phase de groupe",
            description: 'Group C, Jeu 19',
            date_time: '2024-07-31T17:15:00Z',
            location: 'Stade Pierre Mauroy'
        }
    };

    test('renders the event structure correctly', () => {
        render(<OlympicEvent olympicEvent={olympicEvent} />);

        // Check that the event container is rendered using a stable selector
        expect(screen.getByTestId('olympic-event')).toBeInTheDocument();

        // Check that the heading, details and description sections are rendered
        expect(screen.getByTestId('olympic-event-heading')).toBeInTheDocument();
        expect(screen.getByTestId('olympic-event-details')).toBeInTheDocument();
        expect(screen.getByTestId('olympic-event-description')).toBeInTheDocument();

        // Check that the reservation button is present
        expect(screen.getByRole('button', { name: /Réserver/i })).toBeInTheDocument();
    });

    test('renders sport, details, description and reservation button', () => {
        render(<OlympicEvent olympicEvent={olympicEvent} />);

        // Check if the sport is displayed
        expect(screen.getByText(/Basketball/i)).toBeInTheDocument();

        // Check if location appears in details
        expect(screen.getByText(/Stade Pierre Mauroy/i)).toBeInTheDocument();

        // Check if name and description are displayed
        expect(screen.getByText(/Hommes, phase de groupe/i)).toBeInTheDocument();
        expect(screen.getByText(/Group C, Jeu 19/i)).toBeInTheDocument();
    });

    test('matches snapshot', () => {
        const { asFragment } = render(<OlympicEvent olympicEvent={olympicEvent} />);
        expect(asFragment()).toMatchSnapshot();
    });
});

