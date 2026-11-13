import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class RadarSearchResult extends ValueObject {
  constructor(items) {
    super();
    this.items = [...items].sort((a, b) => a.distanceMeters - b.distanceMeters);
    this.total = items.length;
    Object.freeze(this);
  }

  static create(items) {
    return new RadarSearchResult(items);
  }

  isEmpty() {
    return this.total === 0;
  }
}
