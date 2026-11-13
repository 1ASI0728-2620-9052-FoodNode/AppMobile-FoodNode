import { AggregateRoot } from '../../../shared/kernel/AggregateRoot.js';

export class FavoriteList extends AggregateRoot {
  constructor(explorerId, huariqueIds) {
    super(explorerId);
    this.explorerId = explorerId;
    this._huariqueIds = new Set(huariqueIds || []);
  }

  add(huariqueId) {
    this._huariqueIds.add(huariqueId);
  }

  remove(huariqueId) {
    this._huariqueIds.delete(huariqueId);
  }

  has(huariqueId) {
    return this._huariqueIds.has(huariqueId);
  }

  toArray() {
    return [...this._huariqueIds];
  }

  get count() {
    return this._huariqueIds.size;
  }
}
