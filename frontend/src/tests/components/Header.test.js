import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header component', () => {
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

        eventsLinks.forEach(link => expect(link).toHaveAttribute('href', '/olympicEvents'));
        offersLinks.forEach(link => expect(link).toHaveAttribute('href', '/offres'));
        cartLinks.forEach(link => expect(link).toHaveAttribute('href', '/panier'));
        loginLinks.forEach(link => expect(link).toHaveAttribute('href', '/se-connecter'));
    });

    test('matches snapshot', () => {
        const { asFragment } = render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
