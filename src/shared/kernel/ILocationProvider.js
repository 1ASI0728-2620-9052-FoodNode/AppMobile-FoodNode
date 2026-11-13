export class ILocationProvider {
  async requestPermission() {
    throw new Error('not implemented');
  }
  async getCurrentCoordinates() {
    throw new Error('not implemented');
  }
  async reverseGeocode(_coordinates) {
    throw new Error('not implemented');
  }
}

