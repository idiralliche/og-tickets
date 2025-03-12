import React from 'react';
import { render, screen } from '@testing-library/react';
import SportIcon from '../../components/SportIcon';

describe('SportIcon component', () => {
  test('renders the Basketball icon when sport is "Basketball"', () => {
    render(<SportIcon sport='Basketball' />);
    const icon = screen.getByTestId('sport-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.getAttribute('data-icon-name')).toBe('basketball');
    expect(icon.getAttribute('data-icon-name')).not.toBe('default');
  });

  test('renders the default icon when sport is unknown', () => {
    render(<SportIcon sport='UnknownSport' />);
    const icon = screen.getByTestId('sport-icon');
    expect(icon).toBeInTheDocument();
    expect(icon.getAttribute('data-icon-name')).toBe('default');
  });
});
