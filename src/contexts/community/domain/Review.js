import { AggregateRoot } from '../../../shared/kernel/AggregateRoot.js';

export class Review extends AggregateRoot {
  constructor({ id, huariqueId, explorerName, rating, comment, photoUri, verified, createdAt }) {
    super(id);
    this.huariqueId = huariqueId;
    this.explorerName = explorerName;
    this.rating = rating;
    this.comment = comment;
    this.photoUri = photoUri || null;
    this.verified = verified || false;
    this.createdAt = createdAt || new Date();
  }

  static create({ id, huariqueId, explorerName, rating, comment, photoUri, verified }) {
    return new Review({
      id,
      huariqueId,
      explorerName,
      rating,
      comment,
      photoUri,
      verified,
      createdAt: new Date(),
    });
  }
}
