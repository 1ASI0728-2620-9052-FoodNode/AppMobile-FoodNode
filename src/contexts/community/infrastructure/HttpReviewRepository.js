import { httpClient } from '../../../shared/infrastructure/httpClient.js';

export class HttpReviewRepository {
  async getByHuariqueId(huariqueId) {
    const response = await httpClient.get(`/community/huariques/${huariqueId}/reviews`);
    return response.data;
  }

  async publish(reviewData) {
    const response = await httpClient.post(
      `/community/huariques/${reviewData.huariqueId}/reviews`,
      reviewData
    );
    return response.data;
  }
}
