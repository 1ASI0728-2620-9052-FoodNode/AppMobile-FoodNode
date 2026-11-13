import { IRadarRepository } from '../domain/IRadarRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';

export class HttpRadarRepository extends IRadarRepository {
  async searchNearby(latitude, longitude, kRing) {
    const response = await httpClient.post('/radar/search', {
      latitude,
      longitude,
      kRing,
    });
    return response.data;
  }
}
