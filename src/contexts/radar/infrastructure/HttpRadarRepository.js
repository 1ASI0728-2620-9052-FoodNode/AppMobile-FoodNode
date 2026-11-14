import { IRadarRepository } from '../domain/IRadarRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';
import { mapRadarSearchResponse, toRadarError } from './radarMapper.js';

export class HttpRadarRepository extends IRadarRepository {
  async searchNearby(latitude, longitude, kRing) {
    try {
      const response = await httpClient.post('/radar/search', {
        latitude,
        longitude,
        kRing,
      });
      return mapRadarSearchResponse(response.data);
    } catch (err) {
      throw toRadarError(err);
    }
  }
}
