import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../../pages/CartPage';
import { CartContext } from '../../context/CartContext';
import * as offersService from '../../services/offersService';

/**
 * Mock offer object.
 * @constant {Object}
 */
const SoloOffer = { id: 1, name: 'Solo', price: 50 };

/**
 * Mock cart context object.
 * @constant {Object}
 */
const mockCartContext = {
  cart: [],
  totalCart: 0,
  addOffer: jest.fn(),
  updateQuantity: jest.fn(),
  removeOffer: jest.fn(),
};

/**
 * Helper function to render the component with Router and Context providers.
 * @param {ReactElement} ui - The component to render.
 * @param {Object} options - Options for rendering.
 * @param {string} [options.route='/panier'] - The initial route.
 * @param {Object} [options.cartContext=mockCartContext] - The cart context to use.
 * @returns {void}
 */
function customRender(
  ui,
  { route = '/panier', cartContext = mockCartContext } = {}
) {
  return render(
    <CartContext.Provider value={cartContext}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </CartContext.Provider>
  );
}

/**
 * Test suite for the CartPage component.
 * @module CartPageTests
 * @description Verifies the rendering and behavior of the CartPage component.
 */
describe('<CartPage />', () => {
  /**
   * Setup function to reset mocks before each test.
   */
  beforeEach(() => {
    // reset mocks between tests
    jest.clearAllMocks();
  });

  /**
   * @test {CartPage} empty cart
   * @description Verifies that the CartPage component displays the title and the "Voir les offres" link when the cart is empty.
   */
  it('displays the title and the "Voir les offres" link when the cart is empty', () => {
    // mock getOffers so the useEffect() fulfills
    offersService.getOffers = jest.fn().mockResolvedValue([]);
    customRender(<CartPage />);

    // Page title
    expect(
      screen.getByRole('heading', { level: 1, name: /Votre Panier/i })
    ).toBeInTheDocument();

    // Check offers link
    const voir = screen.getByRole('link', { name: /Voir les offres/i });
    expect(voir).toBeInTheDocument();
    expect(voir).toHaveAttribute('href', '/offres');
  });

  /**
   * @test {CartPage} add offer button
   * @description Verifies that the CartPage component displays the "+ Solo" button and calls addOffer on click.
   */
  it('displays the "+ Solo" button and calls addOffer on click', async () => {
    // Empty cart
    mockCartContext.cart = [];
    // Only the Solo offer is available
    offersService.getOffers = jest.fn().mockResolvedValue([SoloOffer]);

    customRender(<CartPage />);

    // findByRole because "+ Solo" button is loaded async in useEffect
    const soloBtn = await screen.findByRole('button', { name: /\+ Solo/i });
    expect(soloBtn).toBeInTheDocument();

    fireEvent.mouseDown(soloBtn);
    fireEvent.mouseUp(soloBtn);

    expect(mockCartContext.addOffer).toHaveBeenCalledWith(SoloOffer);
  });

  /**
   * @test {CartPage} disabled checkout button
   * @description Verifies that the CartPage component disables the order button when there is an item and the user is not logged in.
   */
  it('disables the order button when there is an item and the user is not logged in', async () => {
    // simulate one item in cart
    mockCartContext.cart = [{ offer: SoloOffer, quantity: 1 }];
    mockCartContext.totalCart = 50;
    offersService.getOffers = jest.fn().mockResolvedValue([]);

    customRender(<CartPage />);

    // InCartOffers should render
    expect(await screen.findByTestId('in-cart-offer')).toBeInTheDocument();

    // Order button
    const orderBtn = screen.getByRole('button', { name: /Passer commande/i });
    expect(orderBtn).toBeDisabled();

    // Amount
    expect(screen.getByText(/Total : \$50 €/i)).toBeInTheDocument();
  });
});
