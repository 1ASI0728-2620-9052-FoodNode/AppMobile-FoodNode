import { ValueObject } from './ValueObject.js';
import { DomainError } from './DomainError.js';

export class Coordinates extends ValueObject {
  constructor(latitude, longitude) {
    super();
    if (latitude < -90 || latitude > 90) throw new DomainError('Invalid latitude', 'INVALID_LATITUDE');
    if (longitude < -180 || longitude > 180) throw new DomainError('Invalid longitude', 'INVALID_LONGITUDE');
    this.latitude = latitude;
    this.longitude = longitude;
    Object.freeze(this);
  }
  static create(lat, lng) {
    return new Coordinates(lat, lng);
  }
  toPlainObject() {
    return { latitude: this.latitude, longitude: this.longitude };
  }
}

