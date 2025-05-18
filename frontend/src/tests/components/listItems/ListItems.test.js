import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListItems from '../../../components/listItems/ListItems';

/**
 * Test suite for the ListItems component.
 * @module ListItemsTests
 * @description Verifies the rendering and behavior of the ListItems component.
 */
describe('ListItems', () => {
  const label = 'Article';
  const customClass = 'ma-classe';

  /**
   * @test {ListItems} empty items array
   * @description Verifies that ListItems renders UnavailableData when items is an empty array.
   * It checks for the presence of the unavailable data message and the correct class names.
   */
  it('renders UnavailableData when items is an empty array', () => {
    render(
      <ListItems
        items={[]}
        itemsLabel={label}
        itemsClassName={customClass}
        loading={false}
        error={false}
      />
    );
    const msg = `Aucune ${label} disponible.`;
    const el = screen.getByText(msg);
    expect(el).toBeInTheDocument();

    // Check that the default class is present
    expect(el).toHaveClass('info-message');

    // Check that the custom class is present in the className string
    expect(el.className).toContain(customClass);
  });

  /**
   * @test {ListItems} null items
   * @description Verifies that ListItems renders UnavailableData when items is null.
   * It checks for the presence of the unavailable data message and the correct class names.
   */
  it('renders UnavailableData when items is null', () => {
    render(
      <ListItems items={null} itemsLabel={label} itemsClassName={customClass} />
    );
    const msg = `Aucune ${label} disponible.`;
    const el = screen.getByText(msg);
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('info-message');
    expect(el.className).toContain(customClass);
  });

  /**
   * @test {ListItems} non-empty items
   * @description Verifies that ListItems does not render UnavailableData and renders children when items is not empty.
   * It checks for the absence of the unavailable data message and the presence of child content.
   */
  it('does not render UnavailableData and renders children when items is not empty', () => {
    render(
      <ListItems items={[{ id: 1 }]} itemsLabel={label}>
        <span>Mon contenu</span>
      </ListItems>
    );
    // The unavailable message should not be present
    expect(
      screen.queryByText(`Aucune ${label} disponible.`)
    ).not.toBeInTheDocument();

    // The children should be rendered
    expect(screen.getByText('Mon contenu')).toBeInTheDocument();
  });
});
