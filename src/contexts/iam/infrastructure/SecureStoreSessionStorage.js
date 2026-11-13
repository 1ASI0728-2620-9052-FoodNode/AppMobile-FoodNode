import { ISessionStorage } from '../domain/ISessionStorage.js';
import { secureStorage } from '../../../shared/infrastructure/secureStorage.js';

const SESSION_KEY = 'foodly_session';

export class SecureStoreSessionStorage extends ISessionStorage {
  async saveSession(session) {
    // Save token separately so httpClient interceptor can pick it up
    await secureStorage.saveToken(session.token);

    // Save full session (user + expiry) as JSON via the same secure store
    const SecureStore = await import('expo-secure-store');
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify({
      token: session.token,
      expiresAt: session.expiresAt,
      user: session.user,
    }));
  }

  async getSession() {
    const SecureStore = await import('expo-secure-store');
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async clearSession() {
    await secureStorage.deleteToken();
    const SecureStore = await import('expo-secure-store');
    await SecureStore.deleteItemAsync(SESSION_KEY);
  }
}
