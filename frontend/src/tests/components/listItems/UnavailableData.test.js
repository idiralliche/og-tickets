import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnavailableData from '../../../components/listItems/UnavailableData';

/**
 * Test suite for the UnavailableData component.
 * @module UnavailableDataTests
 * @description Verifies the rendering and behavior of the UnavailableData component.
 */
describe('UnavailableData', () => {
  /**
   * @test {UnavailableData} basic rendering
   * @description Verifies that the UnavailableData component renders the message with the correct class and test-id.
   */
  it('renders the message with the correct class and test-id', () => {
    /**
     * Message to be displayed when no data is available.
     * @constant {string}
     */
    const message = 'Aucune offre disponible.';

    /**
     * Class name for the items, used to construct the test-id and class.
     * @constant {string}
     */
    const itemsClassName = 'offer';

    render(
      <UnavailableData message={message} itemsClassName={itemsClassName} />
    );

    const el = screen.getByTestId(`no-${itemsClassName}`);
    expect(el).toBeInTheDocument();

    // Should have two classes: 'no-offer' and 'info-message'
    expect(el).toHaveClass(`no-${itemsClassName}`, 'info-message');

    // Should display the text passed as a prop
    expect(el).toHaveTextContent(message);
  });
});
