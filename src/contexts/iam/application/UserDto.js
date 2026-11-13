/**
 * @param {{ id, email, name, username, role }} user domain object
 * @returns {{ id: string, email: string, name: string, username: string, role: string }}
 */
export function toUserDto(user) {
  return {
    id: user.id,
    email: typeof user.email === 'object' ? user.email.value : user.email,
    name: user.name,
    username: user.username,
    role: typeof user.role === 'object' ? user.role.value : user.role,
  };
}
