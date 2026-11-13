export class LogoutCommandHandler {
  /**
   * @param {import('../domain/ISessionStorage.js').ISessionStorage} sessionStorage
   */
  constructor(sessionStorage) {
    this._sessionStorage = sessionStorage;
  }

  async execute() {
    await this._sessionStorage.clearSession();
  }
}
