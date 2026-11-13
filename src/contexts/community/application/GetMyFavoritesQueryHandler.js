import { FavoriteDto } from './FavoriteDto.js';

export class GetMyFavoritesQueryHandler {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute() {
    const favorites = await this.favoriteRepository.getMyFavorites();
    return favorites.map((f) => new FavoriteDto({ huariqueId: f.huariqueId, addedAt: f.addedAt }));
  }
}
