export class AddFavoriteCommandHandler {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute({ huariqueId }) {
    await this.favoriteRepository.addFavorite(huariqueId);
  }
}
