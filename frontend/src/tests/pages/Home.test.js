import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import { BrowserRouter } from 'react-router-dom';
import { getOlympicEvents } from '../../services/olympicEventsService';

// Mock the Olympic events service
jest.mock('../../services/olympicEventsService');

/**
 * Test suite for the Home page component.
 * @module HomePageTests
 * @description Verifies the behavior of the Home page component under different data states:
 * - Loading state while fetching data
 * - Successful data loading state
 * - Empty data state
 * - Error states including network issues
 */
describe('Home page', () => {
  /**
   * @test {HomePage} loading state
   * @description Verifies that the loading indicator is displayed during initial data fetch
   */
  test('shows loading state initially', () => {
    // Simulate a pending promise for loading state
    getOlympicEvents.mockReturnValue(new Promise(() => {}));
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Target the loading element by its data-testid
    const loadingElement = screen.getByTestId('loading');
    expect(loadingElement).toBeInTheDocument();
  });

  /**
   * @test {HomePage} successful load
   * @description Verifies that events are displayed and the "view all events" button appears when data is loaded successfully
   */
  test('displays events when loaded by showing the "view all events" button', async () => {
    const validData = [
      {
        id: 1,
        sport: 'Basketball',
        name: 'Hommes, phase de groupe',
        description: 'groupe C, Jeu 19',
        date_time: '2024-07-31T17:15:00Z',
        location: 'Stade Pierre Mauroy',
      },
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

  /**
   * @test {HomePage} empty state
   * @description Verifies that the "no events" message is displayed when no events are available
   */
  test('displays no events message when no events are available', async () => {
    getOlympicEvents.mockResolvedValue([]);
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Target the error element by its data-testid
    const noEventsElement = await screen.findByTestId('no-events');
    expect(noEventsElement).toBeInTheDocument();
  });

  /**
   * @test {HomePage} error state
   * @description Verifies that the error state is displayed when the service fails
   */
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

  /**
   * @test {HomePage} network error
   * @description Verifies that the specific error message is displayed when there is a network issue
   */
  test('displays errorn message in case of network issue', async () => {
    getOlympicEvents.mockRejectedValue(
      new Error("Les offres n'ont pas pu être récupérées.")
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    const errorElement = await screen.findByTestId('error');
    expect(errorElement).toHaveTextContent(
      "Les offres n'ont pas pu être récupérées"
    );
  });
});
