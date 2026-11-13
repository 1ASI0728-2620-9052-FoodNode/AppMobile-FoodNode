export class GetCurrentUserQueryHandler {
  /**
   * @param {import('../domain/IAuthRepository.js').IAuthRepository} authRepository
   */
  constructor(authRepository) {
    this._authRepository = authRepository;
  }

  /**
   * @param {string} token
   */
  async execute(token) {
    return await this._authRepository.getCurrentUser(token);
  }
}
