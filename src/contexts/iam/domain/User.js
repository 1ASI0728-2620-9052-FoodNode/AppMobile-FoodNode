import { AggregateRoot } from '../../../shared/kernel/AggregateRoot.js';

export class User extends AggregateRoot {
  constructor(id, email, name, username, role) {
    super(id);
    this.email = email;
    this.name = name;
    this.username = username;
    this.role = role;
  }

  static create({ id, email, name, username, role }) {
    return new User(id, email, name, username, role);
  }
}
