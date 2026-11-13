import * as Location from 'expo-location';
import { ILocationProvider } from '../kernel/ILocationProvider.js';
import { Coordinates } from '../kernel/Coordinates.js';

export class ExpoLocationProvider extends ILocationProvider {
  async requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }
  async getCurrentCoordinates() {
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return Coordinates.create(loc.coords.latitude, loc.coords.longitude);
  }
  async reverseGeocode(coordinates) {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      if (results.length > 0) {
        const r = results[0];
        return [r.district, r.city].filter(Boolean).join(', ') || 'Lima';
      }
    } catch (_e) {}
    return 'Lima';
  }
}

