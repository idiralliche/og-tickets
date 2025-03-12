import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter } from 'react-router-dom';
import { getOlympicEvents } from '../../services/olympicEventsService';

// Mock the service module
jest.mock('../../services/olympicEventsService');

describe('Home page', () => {
    test('shows loading state initially', () => {
        // Simulate a pending promise for loading state
        getOlympicEvents.mockReturnValue(new Promise(() => { }));
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        // Target the loading element by its data-testid
        const loadingElement = screen.getByTestId('loading');
        expect(loadingElement).toBeInTheDocument();
    });

    test('displays events when loaded by showing the "view all events" button', async () => {
        const validData = [
            {
                id: 1,
                sport: 'Basketball',
                name: 'Hommes, phase de groupe',
                description: 'groupe C, Jeu 19',
                date_time: '2024-07-31T17:15:00Z',
                location: 'Stade Pierre Mauroy',
            }
        ];
        getOlympicEvents.mockResolvedValue(validData);
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Wait for the "view all events" button to appear as a sign that events have loaded
        const viewAllButton = await screen.findByTestId('display-all-events');
        expect(viewAllButton).toBeInTheDocument();
    });

    test('displays no events message when no events are available', async () => {
        getOlympicEvents.mockResolvedValue([]);
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        // Target the no events element by its data-testid
        const noEventsElement = await screen.findByTestId('no-events');
        expect(noEventsElement).toBeInTheDocument();
    });

    test('displays error state when service fails', async () => {
        getOlympicEvents.mockRejectedValue(new Error('Request timed out'));
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );
        // Target the error element by its data-testid
        const errorElement = await screen.findByTestId('error');
        expect(errorElement).toBeInTheDocument();
    });

    test('displays errorn message in case of network issue', async () => {
        getOlympicEvents.mockRejectedValue(new Error('Le serveur ne répond pas'));

        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        const errorElement = await screen.findByTestId('error');
        expect(errorElement).toHaveTextContent('Le serveur ne répond pas');
    })
});
