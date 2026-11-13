import { ReviewDto } from './ReviewDto.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export class PublishVerifiedReviewCommandHandler {
  constructor(reviewRepository, visitVerificationService) {
    this.reviewRepository = reviewRepository;
    this.visitVerificationService = visitVerificationService;
  }

  async execute({ huariqueId, reservationId, rating, comment, photoUri, highlights }) {
    // 1. Validate rating 1-5
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new DomainError('La calificación debe ser entre 1 y 5', 'INVALID_RATING');
    }

    // 2. Validate comment min 20 chars
    if (!comment || typeof comment !== 'string' || comment.trim().length < 20) {
      throw new DomainError('El testimonio debe tener al menos 20 caracteres', 'INVALID_COMMENT');
    }

    // 3. Create review data and publish
    const reviewData = {
      id: 'rv-' + Date.now(),
      huariqueId,
      reservationId,
      rating: ratingNum,
      comment: comment.trim(),
      photoUri: photoUri || null,
      highlights: highlights || [],
      verified: true,
      createdAt: new Date(),
    };

    await this.reviewRepository.publish(reviewData);

    return new ReviewDto({
      id: reviewData.id,
      huariqueId: reviewData.huariqueId,
      explorerName: 'Tú',
      rating: reviewData.rating,
      comment: reviewData.comment,
      photoUri: reviewData.photoUri,
      verified: reviewData.verified,
      createdAt: reviewData.createdAt,
    });
  }
}
