import { MOCK_FLAGS } from '../shared/infrastructure/config.js';
import { ExpoLocationProvider } from '../shared/infrastructure/ExpoLocationProvider.js';

// ── IAM ──────────────────────────────────────────────────────────────────────
import { HttpAuthRepository } from '../contexts/iam/infrastructure/HttpAuthRepository.js';
import { MockAuthRepository } from '../contexts/iam/infrastructure/MockAuthRepository.js';
import { SecureStoreSessionStorage } from '../contexts/iam/infrastructure/SecureStoreSessionStorage.js';
import { RegisterUserCommandHandler } from '../contexts/iam/application/RegisterUserCommandHandler.js';
import { LoginCommandHandler } from '../contexts/iam/application/LoginCommandHandler.js';
import { GetCurrentUserQueryHandler } from '../contexts/iam/application/GetCurrentUserQueryHandler.js';
import { RestoreSessionQueryHandler } from '../contexts/iam/application/RestoreSessionQueryHandler.js';
import { LogoutCommandHandler } from '../contexts/iam/application/LogoutCommandHandler.js';

// ── RADAR ─────────────────────────────────────────────────────────────────────
import { MockRadarRepository } from '../contexts/radar/infrastructure/MockRadarRepository.js';
import { HttpRadarRepository } from '../contexts/radar/infrastructure/HttpRadarRepository.js';
import { H3JsIndexService } from '../contexts/radar/infrastructure/H3JsIndexService.js';
import { BusinessCommunitySummaryAdapter } from '../contexts/radar/infrastructure/BusinessCommunitySummaryAdapter.js';
import { SearchNearbyHuariquesQueryHandler } from '../contexts/radar/application/SearchNearbyHuariquesQueryHandler.js';
import { GetCoverageZoneQueryHandler } from '../contexts/radar/application/GetCoverageZoneQueryHandler.js';

export function createContainer() {
  // ── IAM ────────────────────────────────────────────────────────────────────
  const authRepository = MOCK_FLAGS.auth
    ? new MockAuthRepository()
    : new HttpAuthRepository();

  const sessionStorage = new SecureStoreSessionStorage();

  const registerHandler = new RegisterUserCommandHandler(authRepository, sessionStorage);
  const loginHandler = new LoginCommandHandler(authRepository, sessionStorage);
  const getCurrentUserHandler = new GetCurrentUserQueryHandler(authRepository);
  const restoreSessionHandler = new RestoreSessionQueryHandler(sessionStorage);
  const logoutHandler = new LogoutCommandHandler(sessionStorage);

  // ── RADAR ──────────────────────────────────────────────────────────────────
  const radarRepository = MOCK_FLAGS.radar
    ? new MockRadarRepository()
    : new HttpRadarRepository();

  const h3IndexService = new H3JsIndexService();
  const summaryProvider = new BusinessCommunitySummaryAdapter();
  const locationProvider = new ExpoLocationProvider();

  const searchHandler = new SearchNearbyHuariquesQueryHandler(radarRepository, summaryProvider);
  const coverageHandler = new GetCoverageZoneQueryHandler(h3IndexService);

  return {
    mockFlags: MOCK_FLAGS,
    iam: {
      registerHandler,
      loginHandler,
      getCurrentUserHandler,
      restoreSessionHandler,
      logoutHandler,
    },
    radar: {
      searchHandler,
      coverageHandler,
      locationProvider,
    },
  };
}
