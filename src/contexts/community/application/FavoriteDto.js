export class FavoriteDto {
  constructor({ huariqueId, addedAt }) {
    this.huariqueId = huariqueId;
    this.addedAt = addedAt || new Date();
  }
}
