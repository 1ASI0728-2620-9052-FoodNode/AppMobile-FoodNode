export class Menu {
  constructor({ id, huariqueId, categories }) {
    this.id = id;
    this.huariqueId = huariqueId;
    this.categories = categories ?? [];
  }

  findDish(dishId) {
    for (const category of this.categories) {
      const dish = category.dishes.find((d) => d.id === dishId);
      if (dish) return dish;
    }
    return null;
  }
}
