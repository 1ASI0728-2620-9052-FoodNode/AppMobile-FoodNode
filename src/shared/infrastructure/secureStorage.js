import * as SecureStore from 'expo-secure-store';
const TOKEN_KEY = 'foodly_jwt';
export const secureStorage = {
  async saveToken(token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async getToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },
  async deleteToken() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

