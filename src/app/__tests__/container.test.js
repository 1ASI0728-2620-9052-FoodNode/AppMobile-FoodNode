import { afterEach, describe, expect, jest, test } from '@jest/globals';

const FLAG_VARS = [
  'EXPO_PUBLIC_DEMO_MODE',
  'EXPO_PUBLIC_MOCK_AUTH',
  'EXPO_PUBLIC_MOCK_RADAR',
  'EXPO_PUBLIC_MOCK_BUSINESS',
  'EXPO_PUBLIC_MOCK_COMMUNITY',
  'EXPO_PUBLIC_MOCK_RESERVATION',
  'EXPO_PUBLIC_MOCK_MESSAGING',
  'EXPO_PUBLIC_ENABLE_ROUTES',
];

const original = Object.fromEntries(FLAG_VARS.map((name) => [name, process.env[name]]));

afterEach(() => {
  for (const name of FLAG_VARS) {
    if (original[name] === undefined) delete process.env[name];
    else process.env[name] = original[name];
  }
});

/** Carga container y repositorios con un conjunto de variables, en un registro de módulos aislado. */
function load(env = {}) {
  for (const name of FLAG_VARS) delete process.env[name];
  Object.assign(process.env, env);

  let loaded;
  jest.isolateModules(() => {
    loaded = {
      container: require('../container.js').createContainer(),
      config: require('../../shared/infrastructure/config.js'),
      HttpBusinessRepository: require('../../contexts/business/infrastructure/HttpBusinessRepository.js')
        .HttpBusinessRepository,
      MockBusinessRepository: require('../../contexts/business/infrastructure/MockBusinessRepository.js')
        .MockBusinessRepository,
      HttpFavoriteRepository: require('../../contexts/community/infrastructure/HttpFavoriteRepository.js')
        .HttpFavoriteRepository,
      MockFavoriteRepository: require('../../contexts/community/infrastructure/MockFavoriteRepository.js')
        .MockFavoriteRepository,
      HttpReviewRepository: require('../../contexts/community/infrastructure/HttpReviewRepository.js')
        .HttpReviewRepository,
      MockReviewRepository: require('../../contexts/community/infrastructure/MockReviewRepository.js')
        .MockReviewRepository,
    };
  });
  return loaded;
}

// Lo que desestructuran useFavorites y useReviews.
const COMMUNITY_KEYS = [
  'addFavoriteHandler',
  'removeFavoriteHandler',
  'getFavoritesHandler',
  'reviewsHandler',
  'publishHandler',
  'canPublishHandler',
];

describe('createContainer', () => {
  test('modo demo (por defecto): registra business y community con mocks', () => {
    const { container, HttpBusinessRepository, MockBusinessRepository } = load();

    expect(container.mockFlags.business).toBe(true);
    expect(container.mockFlags.community).toBe(true);
    expect(container.business.getHuariqueHandler.businessRepository).toBeInstanceOf(MockBusinessRepository);
    expect(container.business.getHuariqueHandler.businessRepository).not.toBeInstanceOf(HttpBusinessRepository);
    for (const key of COMMUNITY_KEYS) expect(container.community[key]).toBeDefined();
  });

  test('community usa repositorios Mock por defecto y Http solo con MOCK_COMMUNITY=false', () => {
    const mocked = load({ EXPO_PUBLIC_DEMO_MODE: 'false' });
    expect(mocked.container.community.addFavoriteHandler.favoriteRepository).toBeInstanceOf(
      mocked.MockFavoriteRepository
    );
    expect(mocked.container.community.reviewsHandler.reviewRepository).toBeInstanceOf(
      mocked.MockReviewRepository
    );

    const http = load({ EXPO_PUBLIC_DEMO_MODE: 'false', EXPO_PUBLIC_MOCK_COMMUNITY: 'false' });
    expect(http.container.community.addFavoriteHandler.favoriteRepository).toBeInstanceOf(
      http.HttpFavoriteRepository
    );
    expect(http.container.community.reviewsHandler.reviewRepository).toBeInstanceOf(
      http.HttpReviewRepository
    );
  });

  test('DEMO_MODE=true fuerza los mocks aunque MOCK_COMMUNITY y MOCK_BUSINESS sean false', () => {
    const { container, MockFavoriteRepository, MockBusinessRepository } = load({
      EXPO_PUBLIC_DEMO_MODE: 'true',
      EXPO_PUBLIC_MOCK_COMMUNITY: 'false',
      EXPO_PUBLIC_MOCK_BUSINESS: 'false',
    });

    expect(container.community.addFavoriteHandler.favoriteRepository).toBeInstanceOf(MockFavoriteRepository);
    expect(container.business.getHuariqueHandler.businessRepository).toBeInstanceOf(MockBusinessRepository);
  });

  test('business usa Http solo con MOCK_BUSINESS=false (y DEMO_MODE=false)', () => {
    const byDefault = load({ EXPO_PUBLIC_DEMO_MODE: 'false' });
    expect(byDefault.container.business.getHuariqueMenuHandler.businessRepository).toBeInstanceOf(
      byDefault.MockBusinessRepository
    );

    const http = load({ EXPO_PUBLIC_DEMO_MODE: 'false', EXPO_PUBLIC_MOCK_BUSINESS: 'false' });
    expect(http.container.business.getHuariqueHandler.businessRepository).toBeInstanceOf(
      http.HttpBusinessRepository
    );
    expect(http.container.business.getHuariqueMenuHandler.businessRepository).toBeInstanceOf(
      http.HttpBusinessRepository
    );
  });

  test('el modo demo responde de punta a punta: business y favoritos', async () => {
    const { container } = load();

    const huarique = await container.business.getHuariqueHandler.execute({ huariqueId: 'h1' });
    const menu = await container.business.getHuariqueMenuHandler.execute({ huariqueId: 'h1' });
    expect(huarique.name).toBeTruthy();
    expect(menu.categories[0].dishes.length).toBeGreaterThan(0);

    const { addFavoriteHandler, getFavoritesHandler, removeFavoriteHandler } = container.community;
    await addFavoriteHandler.execute({ huariqueId: 'h1' });
    expect((await getFavoritesHandler.execute()).map((f) => f.huariqueId)).toEqual(['h1']);
    await removeFavoriteHandler.execute({ huariqueId: 'h1' });
    expect(await getFavoritesHandler.execute()).toEqual([]);
  });

  test('mantiene los bloques existentes', () => {
    const { container } = load();
    expect(Object.keys(container.iam)).toContain('loginHandler');
    expect(Object.keys(container.radar)).toContain('searchHandler');
    expect(Object.keys(container.messaging)).toContain('sendHandler');
  });
});

describe('ENABLE_ROUTES', () => {
  test('está apagada por defecto', () => {
    expect(load().config.ENABLE_ROUTES).toBe(false);
  });

  test('solo se enciende con EXPO_PUBLIC_ENABLE_ROUTES=true', () => {
    expect(load({ EXPO_PUBLIC_ENABLE_ROUTES: 'true' }).config.ENABLE_ROUTES).toBe(true);
    expect(load({ EXPO_PUBLIC_ENABLE_ROUTES: 'false' }).config.ENABLE_ROUTES).toBe(false);
    expect(load({ EXPO_PUBLIC_ENABLE_ROUTES: '1' }).config.ENABLE_ROUTES).toBe(false);
  });
});
