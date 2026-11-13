
import { IAuthRepository } from '../domain/IAuthRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';
import { toStorableUser } from './authMapper.js';
import { toBackendRole } from './roleMapper.js';

export class HttpAuthRepository extends IAuthRepository {

  async register(data) {
    await httpClient.post('/iam/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name?.trim() || data.username,
      username: data.username,
      role: toBackendRole(data.role),
    });

    // Después del registro, iniciamos sesión para
    // obtener el JWT y el perfil real del usuario.
    return this.login({
      email: data.email,
      password: data.password,
    });
  }

  async login(credentials) {
    const response = await httpClient.post('/iam/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const json = response.data;
    const token = json.token;

    if (!token) {
      throw new Error('El servidor no devolvió un token JWT');
    }

    // El backend devuelve el usuario completo
    // mediante un endpoint separado.
    const user = await this.getCurrentUser(token);

    return {
      token,
      expiresAt: json.expiresAt,
      user,
    };
  }

  async getCurrentUser(token) {
    const response = await httpClient.get('/iam/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return toStorableUser(response.data);
  }
}
