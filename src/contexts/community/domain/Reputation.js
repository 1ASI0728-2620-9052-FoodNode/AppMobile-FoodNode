import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class Reputation extends ValueObject {
  constructor(averageRating, count) {
    super();
    this.averageRating = averageRating;
    this.count = count;
    Object.freeze(this);
  }

  static fromReviews(reviews) {
    if (!reviews || reviews.length === 0) {
      return new Reputation(0, 0);
    }
    const total = reviews.reduce((sum, r) => sum + r.rating.value, 0);
    return new Reputation(
      Math.round((total / reviews.length) * 10) / 10,
      reviews.length
    );
  }
}
