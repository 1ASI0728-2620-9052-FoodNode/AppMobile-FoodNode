/**
 * Port — Session persistence interface.
 * Infrastructure adapters must implement every method.
 */
export class ISessionStorage {
  /**
   * @param {{ token: string, expiresAt: string, user: object }} session
   * @returns {Promise<void>}
   */
  async saveSession(_session) {
    throw new Error('ISessionStorage.saveSession() not implemented');
  }

  /**
   * @returns {Promise<object|null>} stored session or null
   */
  async getSession() {
    throw new Error('ISessionStorage.getSession() not implemented');
  }

  /** @returns {Promise<void>} */
  async clearSession() {
    throw new Error('ISessionStorage.clearSession() not implemented');
  }
}
