// src/screens/Map/__tests__/useViewportPOIs.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import useViewportPOIs from '../useViewportPOIs';
import { supabase } from '../../../lib/supabase';


const fakeRawRows = [
  { id: 1, titulo: 'Praia de Iracema', latitude: -30.03, longitude: -51.22,
    tags: '["praia"]', categoria: null, reviews: 0, plan_level: 0 },
];

const fakeBounds = {
  getSouthWest: () => ({ lat: -30.05, lng: -51.23 }),
  getNorthEast: () => ({ lat: -30.01, lng: -51.21 }),
};

const fakeMap = {
  getBounds: () => fakeBounds,
  getZoom: () => 14,
  on: vi.fn(),
  off: vi.fn(),
} as any;

const limitMock   = vi.fn().mockResolvedValue({ data: fakeRawRows, count: fakeRawRows.length });
const lteLngMock  = vi.fn().mockReturnValue({ limit: limitMock });
const gteLngMock  = vi.fn().mockReturnValue({ lte: lteLngMock });
const lteLatMock  = vi.fn().mockReturnValue({ gte: gteLngMock });
const gteLatMock  = vi.fn().mockReturnValue({ lte: lteLatMock });
const selectMock  = vi.fn().mockReturnValue({ gte: gteLatMock });
const fromMock    = vi.fn().mockReturnValue({ select: selectMock });

vi.spyOn(supabase, 'from').mockImplementation(fromMock as any);

describe('useViewportPOIs', () => {
  it('fetches POIs inside bounds when zoom >= 12', async () => {
  const { result } = renderHook(() => useViewportPOIs(fakeMap, new Set())); 
  const moveendCall = fakeMap.on.mock.calls.find(call => call[0] === 'moveend');
  const handler = moveendCall![1];
  console.log('firing moveend');          // <-- debug
  act(() => handler());

  await waitFor(() => {
    console.log('pois:', result.current.pois); // <-- debug
    expect(result.current.pois).toHaveLength(1);
  });

  expect(result.current.pois[0].titulo).toBe('Praia de Iracema');
});
});