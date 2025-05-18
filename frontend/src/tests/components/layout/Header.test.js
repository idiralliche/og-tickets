import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../../components/layout/Header';
import { BrowserRouter } from 'react-router-dom';

/**
 * Test suite for the Header component.
 * @module HeaderTests
 * @description Verifies the rendering and functionality of the Header component.
 */
describe('Header component', () => {
  /**
   * @test {Header} basic rendering
   * @description Verifies that the Header component renders the logo and navigation links correctly.
   * It checks for the presence of the logo and ensures that all navigation links are rendered
   * with the correct href attributes.
   */
  test('renders logo and navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Verify that the logo is rendered (based on alt attribute text content, in the logo img tag)
    expect(screen.getByAltText(/og-tickets logo/i)).toBeInTheDocument();

    // Verify that navigation links from NavLinks are rendered
    const eventsLinks = screen.getAllByTestId('nav-link-events');
    const offersLinks = screen.getAllByTestId('nav-link-offers');
    const cartLinks = screen.getAllByTestId('nav-link-cart');
    const loginLinks = screen.getAllByTestId('nav-link-login');

    expect(eventsLinks).toHaveLength(2);
    expect(offersLinks).toHaveLength(2);
    expect(cartLinks).toHaveLength(2);
    expect(loginLinks).toHaveLength(2);

    eventsLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/epreuves')
    );
    offersLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/offres')
    );
    cartLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/panier')
    );
    loginLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', '/acces')
    );
  });

  /**
   * @test {Header} snapshot
   * @description Ensures the Header component matches its saved snapshot.
   */
  test('matches snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
