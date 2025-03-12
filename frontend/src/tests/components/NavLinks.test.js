import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavLinks from '../../components/NavLinks';

describe('NavLinks component', () => {
  test('renders navigation links with correct accessible names and hrefs', () => {
    render(
      <BrowserRouter>
        <NavLinks />
      </BrowserRouter>
    );

    // Retrieve all links by role
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);

    // Verify each expected link is present using getByRole with accessible name
    const eventsLink = screen.getByRole('link', { name: /Les épreuves/i });
    const offersLink = screen.getByRole('link', { name: /Nos offres/i });
    const cartLink = screen.getByRole('link', { name: /Panier/i });
    const loginLink = screen.getByRole('link', { name: /Connexion/i });

    expect(eventsLink).toBeInTheDocument();
    expect(offersLink).toBeInTheDocument();
    expect(cartLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();

    // Check that the links point to the correct routes
    expect(eventsLink).toHaveAttribute('href', '/olympicEvents');
    expect(offersLink).toHaveAttribute('href', '/offres');
    expect(cartLink).toHaveAttribute('href', '/panier');
    expect(loginLink).toHaveAttribute('href', '/se-connecter');
  });
});
