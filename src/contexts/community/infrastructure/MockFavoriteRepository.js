export class MockFavoriteRepository {
  constructor() {
    this._favorites = new Set();
  }

  async getMyFavorites() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return Array.from(this._favorites).map((huariqueId) => ({ huariqueId, addedAt: new Date() }));
  }

  async addFavorite(huariqueId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this._favorites.add(huariqueId);
  }

  async removeFavorite(huariqueId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this._favorites.delete(huariqueId);
  }
}
