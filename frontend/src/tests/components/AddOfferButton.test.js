import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddOfferButton from '../../components/AddOfferButton';
import { CartContext } from '../../context/CartContext';
import { useFlashOnButtonClick } from '../../hooks/useFlashOnButtonClick';

// On mocke le hook pour contrôler isFlashing et triggerFlash
jest.mock('../../hooks/useFlashOnButtonClick');

describe('AddOfferButton', () => {
  const offer = { id: 42, name: 'Solo' };
  let addOfferMock;
  let triggerFlashMock;

  beforeEach(() => {
    addOfferMock = jest.fn();
    triggerFlashMock = jest.fn();
    // Par défaut isFlashing = false
    useFlashOnButtonClick.mockReturnValue([false, triggerFlashMock]);
  });

  it('affiche le libellé "+ Solo"', () => {
    render(
      <CartContext.Provider value={{ addOffer: addOfferMock }}>
        <AddOfferButton offer={offer} />
      </CartContext.Provider>
    );
    expect(screen.getByRole('button', { name: /\+ Solo/ })).toBeInTheDocument();
  });

  it('appelle triggerFlash au onMouseDown', () => {
    render(
      <CartContext.Provider value={{ addOffer: addOfferMock }}>
        <AddOfferButton offer={offer} />
      </CartContext.Provider>
    );
    fireEvent.mouseDown(screen.getByRole('button', { name: /\+ Solo/ }));
    expect(triggerFlashMock).toHaveBeenCalledTimes(1);
  });

  it('appelle addOffer avec la bonne offre au onMouseUp', () => {
    render(
      <CartContext.Provider value={{ addOffer: addOfferMock }}>
        <AddOfferButton offer={offer} />
      </CartContext.Provider>
    );
    fireEvent.mouseUp(screen.getByRole('button', { name: /\+ Solo/ }));
    expect(addOfferMock).toHaveBeenCalledWith(offer);
  });

  it('ajoute la classe "flash" lorsque isFlashing est vrai', () => {
    // On simule maintenant isFlashing = true
    useFlashOnButtonClick.mockReturnValue([true, triggerFlashMock]);

    render(
      <CartContext.Provider value={{ addOffer: addOfferMock }}>
        <AddOfferButton offer={offer} />
      </CartContext.Provider>
    );

    const btn = screen.getByRole('button', { name: /\+ Solo/ });
    expect(btn).toHaveClass('flash');
  });
});
