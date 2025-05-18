import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../../components/layout/Footer';

/**
 * Test suite for the Footer component.
 * @module FooterTests
 * @description Verifies the basic rendering and structure of the Footer component.
 */
describe('Footer component', () => {
  /**
   * @test {Footer} basic rendering
   * @description Verifies that the footer element is rendered with the correct role.
   */
  test('renders footer element', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  /**
   * @test {Footer} snapshot
   * @description Ensures the Footer component matches its saved snapshot.
   */
  test('matches snapshot', () => {
    const { asFragment } = render(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
