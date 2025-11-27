import { render, screen } from '@testing-library/react';
import { expect, it, describe } from 'vitest';
import { POICounter } from '../POICounter';
import '@testing-library/jest-dom';

describe('<POICounter />', () => {
  it('shows total only when total === filtered', () => {
    render(<POICounter total={1234} filtered={1234} />);
    expect(screen.getByText('1.234 POIs Encontrados')).toBeInTheDocument();
  });

  it('shows filtered count when different from total', () => {
    render(<POICounter total={500} filtered={42} />);
    expect(screen.getByText('42 POIs Encontrados')).toBeInTheDocument();
  });

  it('handles zero', () => {
    render(<POICounter total={0} filtered={0} />);
    expect(screen.getByText('0 POIs Encontrados')).toBeInTheDocument();
  });
});