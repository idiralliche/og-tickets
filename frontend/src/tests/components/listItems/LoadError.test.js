import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadError from '../../../components/listItems/LoadError';

/**
 * Test suite for the LoadError component.
 * @module LoadErrorTests
 * @description Verifies the rendering and behavior of the LoadError component.
 */
describe('LoadError', () => {
  /**
   * Label for the items, used in the error message.
   * @constant {string}
   */
  const label = 'Article';

  /**
   * @test {LoadError} basic rendering
   * @description Verifies that the LoadError component displays the error container with the correct class and message.
   */
  it('displays the error container with the correct class and message', () => {
    render(<LoadError itemsLabel={label} />);

    // get the error container via the test-id
    const container = screen.getByTestId('error');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('error-container');

    // get the paragraph by its exact text
    const message = `Les ${label}s n'ont pas pu être récupérées.`;
    const paragraph = screen.getByText(message);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('error-message');
  });
});
