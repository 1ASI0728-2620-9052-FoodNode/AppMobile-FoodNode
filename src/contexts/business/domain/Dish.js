export class Dish {
  constructor({ id, name, description, price, photoUri, tags, available }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.photoUri = photoUri;
    this.tags = tags ?? [];
    this.available = available ?? true;
    Object.freeze(this);
  }
}
