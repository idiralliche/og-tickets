import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InCartOffers from '../../components/InCartOffers';
import { CartContext } from '../../context/CartContext';

// 1) Stub out InCartOffer so we can easily trigger each handler:
jest.mock(
  '../../components/InCartOffer',
  () =>
    ({ item, onIncrement, onDecrement, onQuantityChange, onRemove }) =>
      (
        <div data-testid='in-cart-offer'>
          <span>{item.offer.name}</span>
          <button onClick={() => onIncrement(item.offer.id)}>+</button>
          <button onClick={() => onDecrement(item.offer.id)}>–</button>
          {/* simulate typing "0" into the qty field */}
          <button onClick={() => onQuantityChange(item.offer.id, '0')}>
            set‐zero
          </button>
          <button onClick={() => onRemove(item.offer.id)}>remove</button>
        </div>
      )
);

/**
 * Test suite for the InCartOffers component.
 * @module InCartOffersTests
 * @description Verifies the rendering and behavior of the InCartOffers component.
 */
describe('InCartOffers', () => {
  const twoItems = [
    { offer: { id: 1, name: 'Solo', price: 50 }, quantity: 1 },
    { offer: { id: 2, name: 'Duo', price: 90 }, quantity: 2 },
  ];
  let updateQuantity, removeOffer;

  /**
   * Setup function to initialize mock functions before each test.
   */
  beforeEach(() => {
    updateQuantity = jest.fn();
    removeOffer = jest.fn();
    // ensure confirm always returns true for the zero‐qty case
    window.confirm = jest.fn(() => true);
  });

  /**
   * Helper function to render the InCartOffers component with the necessary context providers.
   * @param {Array} cart - The cart items to render.
   */
  function renderWith(cart) {
    render(
      <CartContext.Provider value={{ cart, updateQuantity, removeOffer }}>
        <InCartOffers />
      </CartContext.Provider>
    );
  }

  /**
   * @test {InCartOffers} basic rendering
   * @description Verifies that the InCartOffers component renders one InCartOffer per item in the cart.
   */
  it('renders one InCartOffer per item in cart', () => {
    renderWith(twoItems);
    const rows = screen.getAllByTestId('in-cart-offer');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Solo');
    expect(rows[1]).toHaveTextContent('Duo');
  });

  /**
   * @test {InCartOffers} increment quantity
   * @description Verifies that clicking "+" calls updateQuantity with quantity + 1.
   */
  it('clicking "+" calls updateQuantity with quantity + 1', () => {
    renderWith(twoItems);
    fireEvent.click(screen.getAllByText('+')[0]);
    expect(updateQuantity).toHaveBeenCalledWith(1, 2 /*1+1*/);
  });

  /**
   * @test {InCartOffers} decrement quantity
   * @description Verifies that clicking "–" calls updateQuantity with quantity – 1.
   */
  it('clicking "–" calls updateQuantity with quantity – 1', () => {
    renderWith(twoItems);
    fireEvent.click(screen.getAllByText('–')[0]);
    expect(updateQuantity).toHaveBeenCalledWith(1, 0 /*1-1*/);
  });

  /**
   * @test {InCartOffers} set quantity to zero
   * @description Verifies that clicking the zero-setter button confirms and then calls updateQuantity(…, 0).
   */
  it('clicking the zero‐setter button confirms and then calls updateQuantity(…, 0)', () => {
    renderWith([twoItems[0]]);
    fireEvent.click(screen.getByText('set‐zero'));
    expect(window.confirm).toHaveBeenCalledWith(
      'Voulez-vous vraiment supprimer cette offre du panier ?'
    );
    expect(updateQuantity).toHaveBeenCalledWith(1, 0);
  });

  /**
   * @test {InCartOffers} remove offer
   * @description Verifies that clicking "remove" calls removeOffer.
   */
  it('clicking "remove" calls removeOffer', () => {
    renderWith(twoItems);
    fireEvent.click(screen.getAllByText('remove')[0]);
    expect(removeOffer).toHaveBeenCalledWith(1);
  });
});
