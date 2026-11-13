import { Coordinates } from '../Coordinates.js';
import { DomainError } from '../DomainError.js';

describe('Coordinates', () => {
  test('creates valid coordinates for Barranco Lima', () => {
    const c = Coordinates.create(-12.1403, -77.0219);
    expect(c.latitude).toBe(-12.1403);
    expect(c.longitude).toBe(-77.0219);
  });
  test('is frozen (immutable)', () => {
    const c = Coordinates.create(-12.1403, -77.0219);
    expect(Object.isFrozen(c)).toBe(true);
  });
  test('throws DomainError on invalid latitude', () => {
    expect(() => Coordinates.create(91, 0)).toThrow(DomainError);
  });
  test('throws DomainError on invalid longitude', () => {
    expect(() => Coordinates.create(0, 181)).toThrow(DomainError);
  });
  test('equality works', () => {
    const a = Coordinates.create(-12.1403, -77.0219);
    const b = Coordinates.create(-12.1403, -77.0219);
    expect(a.equals(b)).toBe(true);
  });
});

