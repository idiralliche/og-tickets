import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Offer from '../../components/Offer';
import { CartContext } from '../../context/CartContext';
import { NotificationContext } from '../../context/NotificationContext';

// Mock our flash hook
import { useFlashOnButtonClick } from '../../hooks/useFlashOnButtonClick';
jest.mock('../../hooks/useFlashOnButtonClick');

/**
 * Test suite for the Offer component.
 * @module OfferTests
 * @description Verifies the rendering and behavior of the Offer component.
 */
describe('<Offer />', () => {
  const fakeOffer = {
    id: 42,
    name: 'Solo',
    description: 'Une place individuelle',
    price: 50,
  };

  let addOffer, showNotification, triggerFlash;

  beforeEach(() => {
    addOffer = jest.fn();
    showNotification = jest.fn();
    // our stubbed hook returns [isFlashing, triggerFlash]
    triggerFlash = jest.fn();
    useFlashOnButtonClick.mockReturnValue([false, triggerFlash]);
  });

  /**
   * Helper function to render the Offer component with the necessary context providers.
   */
  const renderOffer = () => {
    render(
      <CartContext.Provider value={{ addOffer }}>
        <NotificationContext.Provider value={{ showNotification }}>
          <Offer offer={fakeOffer} />
        </NotificationContext.Provider>
      </CartContext.Provider>
    );
  };

  /**
   * @test {Offer} basic rendering
   * @description Verifies that the Offer component renders the name, description, and price correctly.
   */
  it('displays the name, description, and price', () => {
    renderOffer();
    expect(screen.getByTestId('offer-heading')).toHaveTextContent('Solo');
    expect(screen.getByTestId('offer-description')).toHaveTextContent(
      'Une place individuelle'
    );
    expect(screen.getByTestId('offer-price')).toHaveTextContent('50 €');
  });

  /**
   * @test {Offer} button click
   * @description Verifies that clicking the button triggers the flash, adds the offer, and shows a notification.
   */
  it('on click, triggers the flash, adds the offer, and displays a notification', () => {
    renderOffer();
    const btn = screen.getByRole('button', { name: /Ajouter au panier/i });
    fireEvent.click(btn);

    // flash trigger
    expect(triggerFlash).toHaveBeenCalled();

    // addOffer called with our offer object
    expect(addOffer).toHaveBeenCalledWith(fakeOffer);

    // showNotification called with the correct French message and "success"
    expect(showNotification).toHaveBeenCalledWith(
      expect.stringContaining('Une offre Solo ajoutée à votre panier'),
      'success'
    );
  });

  /**
   * @test {Offer} flash class
   * @description Verifies that the "flash" class is added when isFlashing is true.
   */
  it('adds the "flash" class when isFlashing is true', () => {
    // simulate the hook returning true for isFlashing
    useFlashOnButtonClick.mockReturnValue([true, triggerFlash]);
    renderOffer();
    const btn = screen.getByRole('button', { name: /Ajouter au panier/i });
    expect(btn).toHaveClass('flash');
  });
});
