export class ReviewDto {
  constructor({ id, huariqueId, explorerName, rating, comment, photoUri, verified, createdAt }) {
    this.id = id;
    this.huariqueId = huariqueId;
    this.explorerName = explorerName;
    this.rating = rating;
    this.comment = comment;
    this.photoUri = photoUri || null;
    this.verified = verified || false;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  static fromDomain(review) {
    return new ReviewDto({
      id: review.id,
      huariqueId: review.huariqueId,
      explorerName: review.explorerName,
      rating: typeof review.rating === 'object' ? review.rating.value : review.rating,
      comment: typeof review.comment === 'object' ? review.comment.text : review.comment,
      photoUri: review.photoUri || null,
      verified: review.verified || false,
      createdAt: review.createdAt || new Date(),
    });
  }
}
