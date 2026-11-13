import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class HuariqueSummary extends ValueObject {
  constructor({ id, name, photo, cuisineType, priceRange, rating, reviewCount, isOpen, distanceMeters }) {
    super();
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.cuisineType = cuisineType;
    this.priceRange = priceRange;
    this.rating = rating;
    this.reviewCount = reviewCount;
    this.isOpen = isOpen;
    this.distanceMeters = distanceMeters;
    Object.freeze(this);
  }

  static create(props) {
    return new HuariqueSummary(props);
  }
}
