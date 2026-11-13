import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class AuthSession extends ValueObject {
  constructor(token, expiresAt, user) {
    super();
    this.token = token;
    this.expiresAt = expiresAt;
    this.user = user;
  }

  static create({ token, expiresAt, user }) {
    const instance = new AuthSession(token, new Date(expiresAt), user);
    return Object.freeze(instance);
  }

  isExpired() {
    return new Date() >= this.expiresAt;
  }
}
