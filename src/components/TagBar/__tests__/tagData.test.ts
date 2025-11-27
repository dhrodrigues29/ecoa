import { describe, it, expect } from 'vitest';
import { ALL_TAGS } from '../tagData';

describe('ALL_TAGS', () => {
  it('contains no duplicates', () => {
    const set = new Set(ALL_TAGS);
    expect(set.size).toBe(ALL_TAGS.length);
  });

  it('is in the same “random” order on every reload (seeded shuffle)', () => {
    // snapshot the first 10 items
    expect(ALL_TAGS.slice(0, 10)).toMatchInlineSnapshot(`
      [
        "Próximo domingo",
        "Noite de tapas",
        "Cinema ao ar livre",
        "Orgânico",
        "Entrada franca",
        "Sensorial",
        "Electro jam",
        "Brega",
        "Feriado",
        "Artesanal",
      ]
    `);
  });
});