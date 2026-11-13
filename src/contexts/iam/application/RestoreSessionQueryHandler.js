import { AuthSession } from '../domain/AuthSession.js';

export class RestoreSessionQueryHandler {
  /**
   * @param {import('../domain/ISessionStorage.js').ISessionStorage} sessionStorage
   */
  constructor(sessionStorage) {
    this._sessionStorage = sessionStorage;
  }

  /**
   * @returns {Promise<import('../domain/AuthSession.js').AuthSession|null>}
   */
  async execute() {
    const raw = await this._sessionStorage.getSession();
    if (!raw) return null;

    const session = AuthSession.create({
      token: raw.token,
      expiresAt: raw.expiresAt,
      user: raw.user,
    });

    if (session.isExpired()) {
      await this._sessionStorage.clearSession();
      return null;
    }

    return session;
  }
}
