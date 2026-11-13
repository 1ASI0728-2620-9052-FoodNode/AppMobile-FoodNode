import { Email } from '../domain/Email.js';
import { Password } from '../domain/Password.js';
import { Role } from '../domain/Role.js';

export class RegisterUserCommandHandler {
  /**
   * @param {import('../domain/IAuthRepository.js').IAuthRepository} authRepository
   * @param {import('../domain/ISessionStorage.js').ISessionStorage} sessionStorage
   */
  constructor(authRepository, sessionStorage) {
    this._authRepository = authRepository;
    this._sessionStorage = sessionStorage;
  }

  /**
   * @param {{ email: string, password: string, name: string, username: string, role: string }} command
   */
  async execute(command) {
    // Validate via value objects (throws DomainError on failure)
    const email = Email.create(command.email);
    const password = Password.create(command.password);
    const role = Role.create(command.role);

    const result = await this._authRepository.register({
      email: email.value,
      password: password.value,
      name: command.name || '',
      username: command.username,
      role: role.value,
    });

    await this._sessionStorage.saveSession({
      token: result.token,
      expiresAt: result.expiresAt,
      user: result.user,
    });

    return result;
  }
}
