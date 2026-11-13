import { RadarSearchResult } from '../domain/RadarSearchResult.js';
import { RadarSearchResultDto } from './RadarSearchResultDto.js';
import { NearbyHuariquesFound } from '../domain/events/NearbyHuariquesFound.js';
import { NoHuariquesFound } from '../domain/events/NoHuariquesFound.js';
import { EventBus } from '../../../shared/kernel/EventBus.js';

export class SearchNearbyHuariquesQueryHandler {
  constructor(radarRepository, summaryProvider) {
    this._radarRepository = radarRepository;
    this._summaryProvider = summaryProvider;
  }

  async execute(latitude, longitude, kRing = 1) {
    const locations = await this._radarRepository.searchNearby(latitude, longitude, kRing);

    if (!locations || locations.length === 0) {
      EventBus.publish(new NoHuariquesFound({ latitude, longitude }));
      return RadarSearchResultDto.fromDomain(RadarSearchResult.create([]));
    }

    const ids = locations.map((loc) => loc.id);
    const summaries = await this._summaryProvider.getSummaries(ids);

    const items = locations.map((loc) => {
      const summary = summaries.find((s) => s.id === loc.id);
      if (!summary) return null;
      return { ...summary, coordinates: loc.coordinates, distanceMeters: loc.distanceMeters };
    }).filter(Boolean);

    const result = RadarSearchResult.create(
      items.map((item) => ({ ...item }))
    );

    EventBus.publish(new NearbyHuariquesFound(result.items, { latitude, longitude }));
    return RadarSearchResultDto.fromDomain(result);
  }
}
