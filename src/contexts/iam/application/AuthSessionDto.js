import { toUserDto } from './UserDto.js';

/**
 * @param {{ token, user, expiresAt }} session (domain AuthSession or raw)
 * @returns {{ token: string, user: object, isExpired: boolean }}
 */
export function toAuthSessionDto(session) {
  return {
    token: session.token,
    user: session.user ? toUserDto(session.user) : null,
    isExpired: typeof session.isExpired === 'function'
      ? session.isExpired()
      : new Date() >= new Date(session.expiresAt),
  };
}
