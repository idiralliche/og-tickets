import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OlympicEventsPage from '../../pages/OlympicEventsPage';

// 1) Mock out the child component so we don't pull in its async logic
jest.mock('../../components/OlympicEvents', () => () => (
  <div data-testid='mock-olympic-events' />
));

/**
 * Test suite for the OlympicEventsPage component.
 * @module OlympicEventsPageTests
 * @description Verifies the rendering and structure of the OlympicEventsPage component.
 */
describe('<OlympicEventsPage />', () => {
  /**
   * @test {OlympicEventsPage} basic rendering
   * @description Verifies that the OlympicEventsPage component renders the page title, subtitle, subheading, and the OlympicEvents component.
   * It checks for the presence of the main heading, subtitle, subheading, and the mocked child component.
   */
  it('renders the page title, subtitle, subheading and the OlympicEvents component', () => {
    render(
      <MemoryRouter>
        <OlympicEventsPage />
      </MemoryRouter>
    );

    // The main title (h1)
    const mainHeading = screen.getByRole('heading', {
      level: 1,
      name: /Toutes les épreuves des JO 2024/i,
    });
    expect(mainHeading).toBeInTheDocument();

    // The subtitle <p class="subtitle">
    const subtitle = screen.getByText(
      /Découvrez l'ensemble des épreuves programmées pour les Jeux Olympiques 2024/i
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass('subtitle');

    // The page-specific subheading (h2)
    const subHeading = screen.getByRole('heading', {
      level: 2,
      name: /Liste complète des épreuves/i,
    });
    expect(subHeading).toBeInTheDocument();

    // And finally our mocked child
    expect(screen.getByTestId('mock-olympic-events')).toBeInTheDocument();
  });
});
