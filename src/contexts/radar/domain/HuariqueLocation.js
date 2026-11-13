import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class HuariqueLocation extends ValueObject {
  constructor(id, coordinates, distanceMeters) {
    super();
    this.id = id;
    this.coordinates = coordinates;
    this.distanceMeters = distanceMeters;
    Object.freeze(this);
  }

  static create(id, coordinates, distanceMeters) {
    return new HuariqueLocation(id, coordinates, distanceMeters);
  }
}
