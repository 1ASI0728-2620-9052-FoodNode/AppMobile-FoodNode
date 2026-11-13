import { Email } from '../domain/Email.js';
import { Password } from '../domain/Password.js';

export class LoginCommandHandler {
  /**
   * @param {import('../domain/IAuthRepository.js').IAuthRepository} authRepository
   * @param {import('../domain/ISessionStorage.js').ISessionStorage} sessionStorage
   */
  constructor(authRepository, sessionStorage) {
    this._authRepository = authRepository;
    this._sessionStorage = sessionStorage;
  }

  /**
   * @param {{ email: string, password: string }} command
   */
  async execute(command) {
    const email = Email.create(command.email);
    const password = Password.create(command.password);

    const result = await this._authRepository.login({
      email: email.value,
      password: password.value,
    });

    await this._sessionStorage.saveSession({
      token: result.token,
      expiresAt: result.expiresAt,
      user: result.user,
    });

    return result;
  }
}
