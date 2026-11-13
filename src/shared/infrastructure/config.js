import { DEMO_MODE } from '../demo/demoMode.js';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:8000';
export { DEMO_MODE };

export const MOCK_FLAGS = {
  auth: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_AUTH === 'true',
  radar: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_RADAR !== 'false',
  business: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_BUSINESS !== 'false',
  community: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_COMMUNITY !== 'false',
  reservation: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_RESERVATION !== 'false',
  messaging: DEMO_MODE || process.env.EXPO_PUBLIC_MOCK_MESSAGING !== 'false',
};
