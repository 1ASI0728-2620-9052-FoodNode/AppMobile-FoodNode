import { User } from '../domain/User.js';
import { Email } from '../domain/Email.js';
import { Role } from '../domain/Role.js';
import { AuthSession } from '../domain/AuthSession.js';
import { toDomainRole } from './roleMapper.js';

/**
 * Maps a backend user JSON to a domain User aggregate.
 */
export function toDomainUser(json) {
  return User.create({
    id: json.id,
    email: Email.create(json.email),
    name: json.name || '',
    username: json.username || '',
    role: Role.create(toDomainRole(json.role)),
  });
}

/**
 * Maps a backend auth response to a domain AuthSession value object.
 */
export function toDomainSession(json) {
  const user = toDomainUser(json.user);
  return AuthSession.create({
    token: json.token || json.access_token,
    expiresAt: json.expires_at || json.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user,
  });
}

/**
 * Maps a backend user JSON to a plain serialisable object (for session storage).
 */
export function toStorableUser(json) {
  return {
    id: json.id,
    email: typeof json.email === 'object' ? json.email.value : json.email,
    name: json.name || '',
    username: json.username || '',
    role: typeof json.role === 'object' ? json.role.value : toDomainRole(json.role),
  };
}
