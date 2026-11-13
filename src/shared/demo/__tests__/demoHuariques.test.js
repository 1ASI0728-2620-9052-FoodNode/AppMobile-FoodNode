import { describe, expect, test } from '@jest/globals';
import { DEMO_HUARIQUES } from '../demoHuariques.js';
import { BusinessCommunitySummaryAdapter } from '../../../contexts/radar/infrastructure/BusinessCommunitySummaryAdapter.js';
import { MockRadarRepository } from '../../../contexts/radar/infrastructure/MockRadarRepository.js';

describe('demo huarique catalog', () => {
  test('contains ten uniquely identified restaurants', () => {
    expect(DEMO_HUARIQUES).toHaveLength(10);
    expect(new Set(DEMO_HUARIQUES.map((place) => place.id)).size).toBe(10);
  });

  test('every place has a category, coordinates, menu, and reviews', () => {
    DEMO_HUARIQUES.forEach((place) => {
      expect(place.category).toBeTruthy();
      expect(place.coordinates.lat).toBeLessThan(0);
      expect(place.coordinates.lng).toBeLessThan(0);
      expect(place.dishes.length).toBeGreaterThan(0);
      expect(place.reviews.length).toBeGreaterThan(0);
    });
  });

  test('mock radar and detail summaries use the same catalog IDs', async () => {
    const repository = new MockRadarRepository();
    const adapter = new BusinessCommunitySummaryAdapter();
    const locations = await repository.searchNearby(-12.14, -77.02, 1);
    const summaries = await adapter.getSummaries(locations.map((location) => location.id));

    expect(locations).toHaveLength(10);
    expect(summaries.map((place) => place.id)).toEqual(DEMO_HUARIQUES.map((place) => place.id));
    expect(locations.map((location) => location.id)).toEqual(summaries.map((place) => place.id));
  });
});
