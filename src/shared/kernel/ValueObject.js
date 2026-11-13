export class ValueObject {
  equals(other) {
    if (!(other instanceof this.constructor)) return false;
    return JSON.stringify(this) === JSON.stringify(other);
  }
}

