import React from 'react';
import { render, screen, within } from '@testing-library/react';
import Layout from '../../../components/layout/Layout';

// Mock Header and Footer to render only a simple test-id
jest.mock('../../../components/layout/Header', () => () => (
  <header data-testid='header' />
));
jest.mock('../../../components/layout/Footer', () => () => (
  <footer data-testid='footer' />
));

/**
 * Test suite for the Layout component.
 * @module LayoutTests
 * @description Verifies the rendering and behavior of the Layout component.
 */
describe('Layout', () => {
  /**
   * @test {Layout} basic rendering
   * @description Verifies that the Layout component renders the warning message, Header, Footer, title, subtitle, children, and main classes correctly.
   */
  it('displays the warning message, Header, Footer, title, subtitle, children, and main classes', () => {
    const title = 'Ma page de test';
    const subtitle = 'Ceci est un sous-titre';

    render(
      <Layout title={title} subtitle={subtitle} mainClassName='ma-classe'>
        <div data-testid='mon-enfant'>Contenu enfant</div>
      </Layout>
    );

    // 1) Warning message
    expect(
      screen.getByText(
        /Ce site est un projet à but pédagogique – tout est simulé\./i
      )
    ).toBeInTheDocument();

    // 2) Mocked Header and Footer
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();

    // 3) Title (h1)
    expect(
      screen.getByRole('heading', { level: 1, name: title })
    ).toBeInTheDocument();

    // 4) Subtitle
    const sub = screen.getByText(subtitle);
    expect(sub).toBeInTheDocument();
    expect(sub).toHaveClass('subtitle');

    // 5) Main: implicit role "main", classes, and child
    const main = screen.getByRole('main');
    expect(main).toHaveClass('content', 'ma-classe');
    // the child is inside <main>
    expect(within(main).getByTestId('mon-enfant')).toBeInTheDocument();
  });

  /**
   * @test {Layout} no title or subtitle
   * @description Verifies that the Layout component does not render <h1> or <p class="subtitle"> if title/subtitle are not passed.
   */
  it('does not render <h1> or <p class="subtitle"> if title/subtitle are not passed', () => {
    render(
      <Layout>
        <span>Simple enfant</span>
      </Layout>
    );

    // no title
    expect(screen.queryByRole('heading', { level: 1 })).toBeNull();

    // no subtitle (looking for a <p> with the class subtitle)
    expect(
      screen.queryByText(
        (_, el) => el.tagName === 'P' && el.classList.contains('subtitle')
      )
    ).toBeNull();
  });
});
