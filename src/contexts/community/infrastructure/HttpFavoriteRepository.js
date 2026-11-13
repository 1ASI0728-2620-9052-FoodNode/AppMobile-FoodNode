import { httpClient } from '../../../shared/infrastructure/httpClient.js';

export class HttpFavoriteRepository {
  async addFavorite(huariqueId) {
    const response = await httpClient.post(`/community/favorites/${huariqueId}`);
    return response.data;
  }

  async removeFavorite(huariqueId) {
    const response = await httpClient.delete(`/community/favorites/${huariqueId}`);
    return response.data;
  }

  async getMyFavorites() {
    const response = await httpClient.get('/community/favorites/me');
    return (response.data || []).map((item) => ({ huariqueId: item.huariqueId || item.id }));
  }
}
