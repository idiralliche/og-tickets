import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OlympicEvent from '../../components/OlympicEvent';

/**
 * Test suite for the OlympicEvent component.
 * Verifies rendering and content display of Olympic event cards.
 */
describe('OlympicEvent component', () => {
  // Mock data representing an Olympic event
  const olympicEvent = {
    id: 1,
    sport: 'Basketball',
    name: 'Hommes, phase de groupe',
    description: 'groupe C, Jeu 19',
    date_time: '2024-07-31T17:15:00Z',
    location: 'Stade Pierre Mauroy',
  };

  /**
   * Test: Verifies the basic structure of the component is rendered correctly
   * - Checks for the presence of main container and sub-sections
   * - Verifies the reservation button exists
   */
  test('renders the event structure correctly', () => {
    render(
      <MemoryRouter>
        <OlympicEvent olympicEvent={olympicEvent} />
      </MemoryRouter>
    );

    // Main container
    expect(screen.getByTestId('olympic-event')).toBeInTheDocument();

    // Sub-sections
    expect(screen.getByTestId('olympic-event-heading')).toBeInTheDocument();
    expect(screen.getByTestId('olympic-event-details')).toBeInTheDocument();
    expect(screen.getByTestId('olympic-event-description')).toBeInTheDocument();

    // Action button
    expect(
      screen.getByRole('link', { name: /Voir les offres/i }) // Updated to match actual component
    ).toBeInTheDocument();
  });

  /**
   * Test: Verifies all critical content is displayed
   * - Checks sport name is visible
   * - Verifies location is displayed
   * - Confirms event name and description appear
   */
  test('renders sport, details, description and reservation button', () => {
    render(
      <MemoryRouter>
        <OlympicEvent olympicEvent={olympicEvent} />
      </MemoryRouter>
    );

    // Sport name
    expect(screen.getByText(/Basketball/i)).toBeInTheDocument();

    // Location
    expect(screen.getByText(/Stade Pierre Mauroy/i)).toBeInTheDocument();

    // Event details
    expect(screen.getByText(/Hommes, phase de groupe/i)).toBeInTheDocument();
    expect(screen.getByText(/groupe C, Jeu 19/i)).toBeInTheDocument();

    // Offers link
    expect(screen.getByText('Voir les offres')).toBeInTheDocument();
  });

  /**
   * Test: Ensures consistent rendering output
   * - Compares against stored snapshot
   * - Helps detect unintended changes to component output
   */
  test('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <OlympicEvent olympicEvent={olympicEvent} />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
