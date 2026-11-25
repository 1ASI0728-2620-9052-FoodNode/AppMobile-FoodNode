import { Dish } from '../domain/Dish.js';
import { Menu } from '../domain/Menu.js';
import { Money } from '../domain/Money.js';
import { OpenStatus } from '../domain/OpenStatus.js';
import { OpeningSchedule } from '../domain/OpeningSchedule.js';
import { PriceRange } from '../domain/PriceRange.js';

// OpeningSchedule usa 0 = domingo … 6 = sábado (igual que Date.getDay()).
const DAY_OF_WEEK = Object.freeze({
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
});

// Business envía "08:00:00"; el dominio trabaja con "HH:mm".
const toHourMinute = (time) => String(time).slice(0, 5);

/**
 * Convierte HuariqueView de Business al modelo interno de la app.
 *
 * Backend: { id, ownerId, name, address, cuisineType, priceRange: { minimum, maximum },
 *            location: { latitude, longitude }, openStatus, tags, openingHours, images: [{ id, url }], version }
 *
 * `cuisineType` conserva el código del backend (CRIOLLA | MARINA | CHIFA | OTHER): el value
 * object CuisineType de la app usa otro vocabulario y aún no hay una equivalencia acordada.
 */
export function toHuarique(view) {
  return Object.freeze({
    id: view.id,
    ownerId: view.ownerId,
    name: view.name,
    address: view.address,
    cuisineType: view.cuisineType,
    priceRange: PriceRange.create({
      min: Number(view.priceRange?.minimum),
      max: Number(view.priceRange?.maximum),
    }),
    location: {
      latitude: view.location?.latitude,
      longitude: view.location?.longitude,
    },
    openStatus: OpenStatus.create(view.openStatus),
    tags: view.tags ?? [],
    openingSchedule: OpeningSchedule.create(
      (view.openingHours ?? []).map((hours) => ({
        dayOfWeek: DAY_OF_WEEK[hours.day],
        openTime: toHourMinute(hours.opensAt),
        closeTime: toHourMinute(hours.closesAt),
      }))
    ),
    photoUris: (view.images ?? []).map((image) => image.url),
    version: view.version,
  });
}

/**
 * Convierte MenuView de Business a Menu del dominio.
 *
 * Backend: { id, huariqueId, categories: [{ id, name, dishes: [{ id, name, description, price,
 *            available, images: [{ id, url }] }] }], version }
 */
export function toMenu(view) {
  return new Menu({
    id: view.id,
    huariqueId: view.huariqueId,
    categories: (view.categories ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      dishes: (category.dishes ?? []).map(toDish),
    })),
  });
}

function toDish(dish) {
  return new Dish({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    price: Money.create(Number(dish.price)),
    photoUri: dish.images?.[0]?.url ?? null,
    tags: [],
    available: dish.available,
  });
}

/**
 * Convierte un error de axios en un Error con mensaje en español.
 * `error.status` lleva el código HTTP y `error.code` vale 'NOT_FOUND' cuando es un 404.
 */
export function toBusinessError(err) {
  const status = err?.response?.status;
  let message;

  if (status === 401) {
    message = 'Tu sesión expiró. Inicia sesión de nuevo.';
  } else if (status === 403) {
    message = 'No tienes permiso para ver esta información.';
  } else if (status === 404) {
    message = 'No encontramos este huarique o su carta.';
  } else if (status >= 500) {
    message = 'El servicio de huariques no está disponible en este momento. Intenta más tarde.';
  } else if (!err?.response) {
    message = 'No se pudo conectar con el servidor. Revisa tu conexión.';
  } else {
    message = 'No se pudo cargar la información del huarique. Intenta de nuevo.';
  }

  const error = new Error(message);
  error.status = status ?? null;
  error.code = status === 404 ? 'NOT_FOUND' : undefined;
  error.cause = err;
  return error;
}
