import { IBusinessRepository } from '../domain/IBusinessRepository.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';
import { toBusinessError, toHuarique, toMenu } from './businessMapper.js';

// Categoría de la demo -> código CuisineType de Business.
const CUISINE_BY_CATEGORY = Object.freeze({
  Marino: 'MARINA',
  Cevicherías: 'MARINA',
  Criollo: 'CRIOLLA',
  Tradicional: 'CRIOLLA',
  'A la brasa': 'CRIOLLA',
  Chifa: 'CHIFA',
});

// 'S/ 25 - 45' -> { minimum: 25, maximum: 45 }
function parsePriceRange(label) {
  const match = /(\d+(?:[.,]\d+)?)\D+(\d+(?:[.,]\d+)?)/.exec(label ?? '');
  const toNumber = (text) => Number(text.replace(',', '.'));
  return match
    ? { minimum: toNumber(match[1]), maximum: toNumber(match[2]) }
    : { minimum: 0, maximum: 0 };
}

function findPlace(huariqueId) {
  const place = DEMO_HUARIQUES.find((item) => item.id === huariqueId);
  if (!place) throw toBusinessError({ response: { status: 404 } });
  return place;
}

/**
 * Responde con el catálogo demo, armado con la misma forma que Business (HuariqueView/MenuView)
 * y pasado por el mismo mapper, para que mock y Http entreguen objetos idénticos en forma.
 */
export class MockBusinessRepository extends IBusinessRepository {
  async getHuariqueById(huariqueId) {
    const place = findPlace(huariqueId);
    return toHuarique({
      id: place.id,
      ownerId: 'demo-owner',
      name: place.name,
      address: place.address,
      cuisineType: CUISINE_BY_CATEGORY[place.category] ?? 'OTHER',
      priceRange: parsePriceRange(place.priceRange),
      location: { latitude: place.coordinates.lat, longitude: place.coordinates.lng },
      openStatus: place.isOpen ? 'OPEN' : 'CLOSED',
      tags: place.tags ?? [],
      openingHours: [],
      images: place.photo ? [{ id: `${place.id}-photo`, url: place.photo }] : [],
      version: 0,
    });
  }

  async getMenuByHuariqueId(huariqueId) {
    const place = findPlace(huariqueId);
    return toMenu({
      id: `${place.id}-menu`,
      huariqueId: place.id,
      categories: [
        {
          id: `${place.id}-platos`,
          name: 'Platos',
          dishes: (place.dishes ?? []).map((dish, index) => ({
            id: `${place.id}-d${index + 1}`,
            name: dish.name,
            description: dish.description ?? '',
            price: dish.price,
            available: true,
            images: [],
          })),
        },
      ],
      version: 0,
    });
  }
}
