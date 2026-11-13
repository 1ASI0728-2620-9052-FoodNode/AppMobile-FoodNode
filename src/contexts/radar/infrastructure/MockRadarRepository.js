import { IRadarRepository } from '../domain/IRadarRepository.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';

function randomDelay() {
  return 300 + Math.random() * 500; // 300–800 ms
}

export class MockRadarRepository extends IRadarRepository {
  async searchNearby(_lat, _lng, _kRing) {
    await new Promise((resolve) => setTimeout(resolve, randomDelay()));
    return DEMO_HUARIQUES.map(({ id, coordinates, distanceMeters }) => ({
      id,
      coordinates,
      distanceMeters,
    }));
  }
}
