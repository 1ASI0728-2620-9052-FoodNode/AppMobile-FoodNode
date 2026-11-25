import { describe, expect, test } from '@jest/globals';
import { toBusinessError, toHuarique, toMenu } from '../businessMapper.js';

// Forma real de HuariqueView / MenuView de Foodly-Business-Service.
const HUARIQUE_VIEW = {
  id: 'd297baf2-2495-4c38-9beb-56d18508ab39',
  ownerId: 'a519c2ae-9ac5-40ac-9149-470bf3bb9e96',
  name: 'El Huarique de Doña Rosa',
  address: 'Av. Larco 123, Miraflores',
  cuisineType: 'CRIOLLA',
  priceRange: { minimum: 15.0, maximum: 45.5 },
  location: { latitude: -12.1219, longitude: -77.0297 },
  openStatus: 'OPEN',
  tags: ['casero'],
  openingHours: [{ day: 'MONDAY', opensAt: '08:00:00', closesAt: '17:30:00' }],
  images: [{ id: 'img-1', url: 'https://res.cloudinary.com/example/a.jpg' }],
  version: 2,
};

const MENU_VIEW = {
  id: 'menu-1',
  huariqueId: HUARIQUE_VIEW.id,
  categories: [
    {
      id: 'cat-1',
      name: 'Fondos',
      dishes: [
        {
          id: 'dish-1',
          name: 'Arroz con pollo',
          description: 'Con salsa huancaína',
          price: 18.5,
          available: true,
          images: [{ id: 'img-2', url: 'https://res.cloudinary.com/example/b.jpg' }],
        },
        { id: 'dish-2', name: 'Causa', description: '', price: 12, available: false, images: [] },
      ],
    },
  ],
  version: 0,
};

describe('toHuarique', () => {
  test('mapea perfil, ubicación, precio, estado y fotos', () => {
    const huarique = toHuarique(HUARIQUE_VIEW);

    expect(huarique.id).toBe(HUARIQUE_VIEW.id);
    expect(huarique.name).toBe('El Huarique de Doña Rosa');
    expect(huarique.cuisineType).toBe('CRIOLLA');
    expect(huarique.location).toEqual({ latitude: -12.1219, longitude: -77.0297 });
    expect(huarique.priceRange.min).toBe(15);
    expect(huarique.priceRange.max).toBe(45.5);
    expect(huarique.openStatus.isOpen()).toBe(true);
    expect(huarique.photoUris).toEqual(['https://res.cloudinary.com/example/a.jpg']);
    expect(huarique.version).toBe(2);
  });

  test('convierte el horario a día 0-6 (domingo = 0) y HH:mm', () => {
    const { openingSchedule } = toHuarique(HUARIQUE_VIEW);

    expect(openingSchedule.schedules).toEqual([{ dayOfWeek: 1, openTime: '08:00', closeTime: '17:30' }]);
    // Un lunes a las 10:00 está abierto; el martes no.
    expect(openingSchedule.isOpenAt(new Date(2026, 10, 23, 10, 0))).toBe(true);
    expect(openingSchedule.isOpenAt(new Date(2026, 10, 24, 10, 0))).toBe(false);
  });

  test('tolera huarique sin horarios, etiquetas ni imágenes', () => {
    const huarique = toHuarique({
      ...HUARIQUE_VIEW,
      openStatus: 'CLOSED',
      openingHours: undefined,
      tags: undefined,
      images: undefined,
    });

    expect(huarique.openStatus.isClosed()).toBe(true);
    expect(huarique.openingSchedule.schedules).toEqual([]);
    expect(huarique.tags).toEqual([]);
    expect(huarique.photoUris).toEqual([]);
  });

  test('rechaza un openStatus desconocido', () => {
    expect(() => toHuarique({ ...HUARIQUE_VIEW, openStatus: 'ACTIVE' })).toThrow('Invalid open status');
  });
});

describe('toMenu', () => {
  test('mapea categorías y platos con Money, foto y disponibilidad', () => {
    const menu = toMenu(MENU_VIEW);

    expect(menu.huariqueId).toBe(HUARIQUE_VIEW.id);
    expect(menu.categories).toHaveLength(1);
    const dish = menu.findDish('dish-1');
    expect(dish.name).toBe('Arroz con pollo');
    expect(dish.price.amount).toBe(18.5);
    expect(dish.price.format()).toBe('S/ 18.5');
    expect(dish.photoUri).toBe('https://res.cloudinary.com/example/b.jpg');
    expect(menu.findDish('dish-2').available).toBe(false);
    expect(menu.findDish('dish-2').photoUri).toBeNull();
  });

  test('carta vacía', () => {
    expect(toMenu({ ...MENU_VIEW, categories: [] }).categories).toEqual([]);
  });
});

describe('toBusinessError', () => {
  test.each([
    [401, /sesión expiró/, undefined],
    [403, /permiso/, undefined],
    [404, /No encontramos/, 'NOT_FOUND'],
    [503, /no está disponible/, undefined],
  ])('estado %s', (status, message, code) => {
    const error = toBusinessError({ response: { status } });
    expect(error.message).toMatch(message);
    expect(error.status).toBe(status);
    expect(error.code).toBe(code);
  });

  test('sin respuesta (red caída)', () => {
    const error = toBusinessError(new Error('Network Error'));
    expect(error.message).toMatch(/No se pudo conectar/);
    expect(error.status).toBeNull();
  });
});
