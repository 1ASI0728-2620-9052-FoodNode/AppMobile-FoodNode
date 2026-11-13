import { IAuthRepository } from '../domain/IAuthRepository.js';
import { Roles } from '../domain/Role.js';

const FAKE_DELAY = () => 300 + Math.random() * 500;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let _nextId = 1;

function generateJwt() {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ sub: String(_nextId), iat: Math.floor(Date.now() / 1000) }),
  );
  const sig = btoa(String(Math.random()));
  return `${header}.${payload}.${sig}`;
}

export class MockAuthRepository extends IAuthRepository {
  constructor() {
    super();
    this._users = new Map();
  }

  async register(data) {
    await sleep(FAKE_DELAY());

    if ([...this._users.values()].some((u) => u.email === data.email)) {
      const error = new Error('Email already registered');
      error.response = { status: 409 };
      throw error;
    }

    const id = String(_nextId++);
    const user = {
      id,
      email: data.email,
      name: data.name || '',
      username: data.username,
      role: data.role || Roles.GASTRONOMIC_EXPLORER,
    };

    this._users.set(id, { ...user, password: data.password });

    return {
      token: generateJwt(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user,
    };
  }

  async login(credentials) {
    await sleep(FAKE_DELAY());

    const entry = [...this._users.values()].find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (!entry) {
      const error = new Error('Credenciales inválidas');
      error.response = { status: 401 };
      throw error;
    }

    const { password: _, ...user } = entry;

    return {
      token: generateJwt(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      user,
    };
  }

  async getCurrentUser(token) {
    await sleep(FAKE_DELAY());

    // For mock, return the most recently created user
    const entries = [...this._users.values()];
    if (entries.length === 0) {
      const error = new Error('No authenticated user');
      error.response = { status: 401 };
      throw error;
    }
    const { password: _, ...user } = entries[entries.length - 1];
    return user;
  }
}
