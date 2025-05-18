import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ActivationResult from '../../components/ActivationResult';

// Mock LoadingSpinner correctly (go up two levels)
jest.mock('../../components/LoadingSpinner', () => () => (
  <div data-testid='loading-spinner' />
));

/**
 * Test suite for the ActivationResult component.
 * @module ActivationResultTests
 * @description Verifies the rendering and behavior of the ActivationResult component.
 */
describe('ActivationResult', () => {
  /**
   * @test {ActivationResult} pending status
   * @description Verifies that the ActivationResult component displays a spinner when status is "pending".
   */
  it('displays a spinner when status is "pending"', () => {
    render(
      <MemoryRouter>
        <ActivationResult status='pending' />
      </MemoryRouter>
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  /**
   * @test {ActivationResult} success status
   * @description Verifies that the ActivationResult component displays the success message when status is "success".
   */
  it('displays the success message when status is "success"', () => {
    render(
      <MemoryRouter>
        <ActivationResult status='success' />
      </MemoryRouter>
    );
    expect(screen.getByTestId('success')).toBeInTheDocument();
    expect(screen.getByText(/Votre compte est activé !/i)).toBeInTheDocument();
  });

  /**
   * @test {ActivationResult} error status
   * @description Verifies that the ActivationResult component displays the error message and link when status is "error".
   */
  it('displays the error message and link when status is "error"', () => {
    render(
      <MemoryRouter>
        <ActivationResult status='error' />
      </MemoryRouter>
    );
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(
      screen.getByText(/Impossible d’activer le compte/i)
    ).toBeInTheDocument();
    // also check for the presence of the link
    expect(
      screen.getByRole('link', { name: /Retour à la page connexion/i })
    ).toBeInTheDocument();
  });

  /**
   * @test {ActivationResult} unknown status
   * @description Verifies that the ActivationResult component renders nothing for an unknown status.
   */
  it('renders nothing for an unknown status', () => {
    render(
      <MemoryRouter>
        <ActivationResult status='whatever' />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('loading-spinner')).toBeNull();
    expect(screen.queryByTestId('success')).toBeNull();
    expect(screen.queryByTestId('error')).toBeNull();
  });
});
