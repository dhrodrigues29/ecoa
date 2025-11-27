import { renderHook, act } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import useCardStack from '../useCardStack';

// minimal router context mock
vi.mock('../../../app/router', () => ({
  useRouter: () => ({ stack: [{ payload: { cardArray: fakeCards, initialIndex: 2 } }] }),
}));

const fakeCards = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  title: `POI ${i}`,
  img: '',
  url: '#',
  raw: {},
  latitude: 0,
  longitude: 0,
}));

let mockPayload = { cardArray: fakeCards, initialIndex: 2 };
vi.mock('../../../app/router', () => ({
  useRouter: () => ({ stack: [{ payload: mockPayload }] }),
}));

const setIndex = (idx: number) => {
  mockPayload = { ...mockPayload, initialIndex: idx };
};

describe('useCardStack', () => {
  it('starts at given initial index', () => {
    const { result } = renderHook(() => useCardStack());
    expect(result.current.idx).toBe(2);
  });

  it('next wraps to 0 after last card', () => {
    setIndex(4);                       // start at last card
    const { result } = renderHook(() => useCardStack());
    act(() => result.current.next());  // 4 → 0
    expect(result.current.idx).toBe(0);
  });

  it('prev wraps to last card when at 0', () => {
    setIndex(0);                       // start at first card
    const { result } = renderHook(() => useCardStack());
    act(() => result.current.prev());  // 0 → 4
    expect(result.current.idx).toBe(4);
  });
});