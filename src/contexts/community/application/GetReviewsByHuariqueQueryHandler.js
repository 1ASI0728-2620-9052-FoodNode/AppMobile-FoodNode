import { ReviewDto } from './ReviewDto.js';

export class GetReviewsByHuariqueQueryHandler {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(huariqueId) {
    const reviews = await this.reviewRepository.getByHuariqueId(huariqueId);
    return reviews.map((r) => ReviewDto.fromDomain(r));
  }
}
