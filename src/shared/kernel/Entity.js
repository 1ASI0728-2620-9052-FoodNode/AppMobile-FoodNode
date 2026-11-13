export class Entity {
  constructor(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }
  equals(other) {
    return other instanceof Entity && this._id === other._id;
  }
}

