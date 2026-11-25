import { beforeEach, describe, expect, jest, test } from '@jest/globals';

jest.mock('../../../../shared/infrastructure/httpClient.js', () => ({
  httpClient: { get: jest.fn() },
}));

import { httpClient } from '../../../../shared/infrastructure/httpClient.js';
import { HttpBusinessRepository } from '../HttpBusinessRepository.js';
import { MockBusinessRepository } from '../MockBusinessRepository.js';
import { DEMO_HUARIQUES } from '../../../../shared/demo/demoHuariques.js';

const ID = 'd297baf2-2495-4c38-9beb-56d18508ab39';

const HUARIQUE_VIEW = {
  id: ID,
  ownerId: 'owner',
  name: 'El Huarique',
  address: 'Lima 123',
  cuisineType: 'MARINA',
  priceRange: { minimum: 10, maximum: 50 },
  location: { latitude: -12, longitude: -77 },
  openStatus: 'CLOSED',
  tags: [],
  openingHours: [],
  images: [],
  version: 0,
};

const MENU_VIEW = {
  id: 'menu-1',
  huariqueId: ID,
  categories: [
    {
      id: 'cat-1',
      name: 'Fondos',
      dishes: [{ id: 'dish-1', name: 'Arroz', description: '', price: 10, available: true, images: [] }],
    },
  ],
  version: 0,
};

describe('HttpBusinessRepository', () => {
  const repository = new HttpBusinessRepository();

  beforeEach(() => {
    httpClient.get.mockReset();
  });

  test('getHuariqueById hace GET /business-api/huariques/{id} y mapea la respuesta', async () => {
    httpClient.get.mockResolvedValue({ data: HUARIQUE_VIEW });

    const huarique = await repository.getHuariqueById(ID);

    expect(httpClient.get).toHaveBeenCalledWith(`/business-api/huariques/${ID}`);
    expect(huarique.name).toBe('El Huarique');
    expect(huarique.openStatus.isClosed()).toBe(true);
  });

  test('getMenuByHuariqueId hace GET /business-api/huariques/{id}/menu y mapea la carta', async () => {
    httpClient.get.mockResolvedValue({ data: MENU_VIEW });

    const menu = await repository.getMenuByHuariqueId(ID);

    expect(httpClient.get).toHaveBeenCalledWith(`/business-api/huariques/${ID}/menu`);
    expect(menu.findDish('dish-1').name).toBe('Arroz');
  });

  test('escapa el id en la URL', async () => {
    httpClient.get.mockResolvedValue({ data: HUARIQUE_VIEW });

    await repository.getHuariqueById('a/b?c');

    expect(httpClient.get).toHaveBeenCalledWith('/business-api/huariques/a%2Fb%3Fc');
  });

  test('un 404 llega como error NOT_FOUND con mensaje en español', async () => {
    httpClient.get.mockRejectedValue({ response: { status: 404 } });

    await expect(repository.getMenuByHuariqueId(ID)).rejects.toMatchObject({
      code: 'NOT_FOUND',
      status: 404,
    });
  });

  test('sin red llega como error de conexión', async () => {
    httpClient.get.mockRejectedValue(new Error('Network Error'));

    await expect(repository.getHuariqueById(ID)).rejects.toThrow(/No se pudo conectar/);
  });
});

describe('MockBusinessRepository (modo demo)', () => {
  const repository = new MockBusinessRepository();
  const demo = DEMO_HUARIQUES[0];

  test('devuelve el huarique de la demo con la misma forma que Http', async () => {
    const huarique = await repository.getHuariqueById(demo.id);

    expect(huarique.id).toBe(demo.id);
    expect(huarique.name).toBe(demo.name);
    expect(huarique.location).toEqual({ latitude: demo.coordinates.lat, longitude: demo.coordinates.lng });
    expect(huarique.priceRange.min).toBeLessThanOrEqual(huarique.priceRange.max);
    expect(huarique.openStatus.isOpen()).toBe(demo.isOpen);
  });

  test('devuelve la carta de la demo', async () => {
    const menu = await repository.getMenuByHuariqueId(demo.id);

    expect(menu.huariqueId).toBe(demo.id);
    expect(menu.categories[0].dishes).toHaveLength(demo.dishes.length);
    expect(menu.categories[0].dishes[0].price.amount).toBe(demo.dishes[0].price);
  });

  test('todos los huariques de la demo se mapean sin errores', async () => {
    for (const place of DEMO_HUARIQUES) {
      await expect(repository.getHuariqueById(place.id)).resolves.toBeDefined();
      await expect(repository.getMenuByHuariqueId(place.id)).resolves.toBeDefined();
    }
  });

  test('un id desconocido es NOT_FOUND', async () => {
    await expect(repository.getHuariqueById('zzz')).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });
});
