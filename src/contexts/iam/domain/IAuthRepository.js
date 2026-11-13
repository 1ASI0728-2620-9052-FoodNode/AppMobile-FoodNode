/**
 * Port — Auth repository interface.
 * Infrastructure adapters must implement every method.
 */
export class IAuthRepository {
  /**
   * @param {{ email: string, password: string, name: string, username: string, role: string }} data
   * @returns {Promise<{ token: string, expiresAt: string, user: object }>}
   */
  async register(_data) {
    throw new Error('IAuthRepository.register() not implemented');
  }

  /**
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ token: string, expiresAt: string, user: object }>}
   */
  async login(_credentials) {
    throw new Error('IAuthRepository.login() not implemented');
  }

  /**
   * @param {string} token
   * @returns {Promise<object>} user data
   */
  async getCurrentUser(_token) {
    throw new Error('IAuthRepository.getCurrentUser() not implemented');
  }
}
