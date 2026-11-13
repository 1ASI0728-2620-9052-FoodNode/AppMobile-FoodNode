export class RemoveFavoriteCommandHandler {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute({ huariqueId }) {
    await this.favoriteRepository.removeFavorite(huariqueId);
  }
}
