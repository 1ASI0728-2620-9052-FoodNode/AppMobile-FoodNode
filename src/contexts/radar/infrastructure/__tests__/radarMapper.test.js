import { describe, expect, test } from '@jest/globals';
import { mapRadarSearchResponse, toRadarError } from '../radarMapper.js';

describe('mapRadarSearchResponse', () => {
  test('mapea la respuesta del backend al formato de MockRadarRepository', () => {
    const data = {
      huariques: [
        { huariqueId: 'h1', latitude: -12.1498, longitude: -77.0211, distanceMeters: 320 },
        { huariqueId: 'h2', latitude: -12.1405, longitude: -77.0222, distanceMeters: 45.5 },
      ],
      total: 2,
    };

    expect(mapRadarSearchResponse(data)).toEqual([
      { id: 'h1', coordinates: { lat: -12.1498, lng: -77.0211 }, distanceMeters: 320 },
      { id: 'h2', coordinates: { lat: -12.1405, lng: -77.0222 }, distanceMeters: 45.5 },
    ]);
  });

  test('200 con total 0 devuelve []', () => {
    expect(mapRadarSearchResponse({ huariques: [], total: 0 })).toEqual([]);
  });

  test('respuestas sin huariques devuelven []', () => {
    expect(mapRadarSearchResponse({})).toEqual([]);
    expect(mapRadarSearchResponse(null)).toEqual([]);
    expect(mapRadarSearchResponse(undefined)).toEqual([]);
  });
});

describe('toRadarError', () => {
  const withStatus = (status) => toRadarError({ response: { status } });

  test('400 explica que la ubicación no es válida', () => {
    expect(withStatus(400).message).toMatch(/ubicación/i);
  });

  test('401 pide iniciar sesión', () => {
    const error = withStatus(401);
    expect(error.message).toMatch(/sesión/i);
    expect(error.status).toBe(401);
  });

  test('5xx indica servicio no disponible', () => {
    expect(withStatus(500).message).toMatch(/no está disponible/i);
    expect(withStatus(503).message).toMatch(/no está disponible/i);
  });

  test('sin respuesta (red caída) indica problema de conexión', () => {
    const error = toRadarError(new Error('Network Error'));
    expect(error.message).toMatch(/conectar/i);
    expect(error.status).toBeNull();
  });

  test('conserva el error original en cause', () => {
    const original = { response: { status: 500 } };
    expect(toRadarError(original).cause).toBe(original);
  });
});
