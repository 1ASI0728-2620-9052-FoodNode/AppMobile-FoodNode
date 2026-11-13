import { IAuthRepository } from '../domain/IAuthRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';
import { toDomainUser, toStorableUser } from './authMapper.js';
import { toBackendRole } from './roleMapper.js';

export class HttpAuthRepository extends IAuthRepository {
  async register(data) {
    const response = await httpClient.post('/iam/auth/register', {
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username,
      role: toBackendRole(data.role),
    });

    const json = response.data;
    const user = toDomainUser(json.user);

    return {
      token: json.token || json.access_token,
      expiresAt: json.expires_at || json.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: toStorableUser(json.user),
    };
  }

  async login(credentials) {
    const response = await httpClient.post('/iam/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const json = response.data;

    return {
      token: json.token || json.access_token,
      expiresAt: json.expires_at || json.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user: toStorableUser(json.user),
    };
  }

  async getCurrentUser(token) {
    const response = await httpClient.get('/iam/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return toStorableUser(response.data);
  }
}
