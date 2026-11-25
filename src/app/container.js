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

// ── BUSINESS ──────────────────────────────────────────────────────────────────
import { MockBusinessRepository } from '../contexts/business/infrastructure/MockBusinessRepository.js';
import { HttpBusinessRepository } from '../contexts/business/infrastructure/HttpBusinessRepository.js';
import { GetHuariqueByIdQueryHandler } from '../contexts/business/application/GetHuariqueByIdQueryHandler.js';
import { GetHuariqueMenuQueryHandler } from '../contexts/business/application/GetHuariqueMenuQueryHandler.js';

// ── COMMUNITY ─────────────────────────────────────────────────────────────────
import { MockFavoriteRepository } from '../contexts/community/infrastructure/MockFavoriteRepository.js';
import { HttpFavoriteRepository } from '../contexts/community/infrastructure/HttpFavoriteRepository.js';
import { MockReviewRepository } from '../contexts/community/infrastructure/MockReviewRepository.js';
import { HttpReviewRepository } from '../contexts/community/infrastructure/HttpReviewRepository.js';
import { ReservationVisitAdapter } from '../contexts/community/infrastructure/ReservationVisitAdapter.js';
import { AddFavoriteCommandHandler } from '../contexts/community/application/AddFavoriteCommandHandler.js';
import { RemoveFavoriteCommandHandler } from '../contexts/community/application/RemoveFavoriteCommandHandler.js';
import { GetMyFavoritesQueryHandler } from '../contexts/community/application/GetMyFavoritesQueryHandler.js';
import { GetReviewsByHuariqueQueryHandler } from '../contexts/community/application/GetReviewsByHuariqueQueryHandler.js';
import { PublishVerifiedReviewCommandHandler } from '../contexts/community/application/PublishVerifiedReviewCommandHandler.js';
import { CanPublishReviewQueryHandler } from '../contexts/community/application/CanPublishReviewQueryHandler.js';

// ── MESSAGING ─────────────────────────────────────────────────────────────────
import { MockLiaChatRepository } from '../contexts/messaging/infrastructure/MockLiaChatRepository.js';
import { HttpLiaChatRepository } from '../contexts/messaging/infrastructure/HttpLiaChatRepository.js';
import { SendMessageToLiaCommandHandler } from '../contexts/messaging/application/SendMessageToLiaCommandHandler.js';
import { GetMyConversationQueryHandler } from '../contexts/messaging/application/GetMyConversationQueryHandler.js';
import { GetConversationMessagesQueryHandler } from '../contexts/messaging/application/GetConversationMessagesQueryHandler.js';
import { LiaResponsePoller } from '../contexts/messaging/application/LiaResponsePoller.js';

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

  // ── BUSINESS ───────────────────────────────────────────────────────────────
  const businessRepository = MOCK_FLAGS.business
    ? new MockBusinessRepository()
    : new HttpBusinessRepository();

  const getHuariqueHandler = new GetHuariqueByIdQueryHandler(businessRepository);
  const getHuariqueMenuHandler = new GetHuariqueMenuQueryHandler(businessRepository);

  // ── COMMUNITY ──────────────────────────────────────────────────────────────
  // Mock por defecto; Http solo con EXPO_PUBLIC_MOCK_COMMUNITY=false (y DEMO_MODE=false).
  const favoriteRepository = MOCK_FLAGS.community
    ? new MockFavoriteRepository()
    : new HttpFavoriteRepository();
  const reviewRepository = MOCK_FLAGS.community
    ? new MockReviewRepository()
    : new HttpReviewRepository();
  // Sin contexto de reservas real todavía: siempre responde "visita no verificada".
  const visitVerificationService = new ReservationVisitAdapter();

  const addFavoriteHandler = new AddFavoriteCommandHandler(favoriteRepository);
  const removeFavoriteHandler = new RemoveFavoriteCommandHandler(favoriteRepository);
  const getFavoritesHandler = new GetMyFavoritesQueryHandler(favoriteRepository);
  const reviewsHandler = new GetReviewsByHuariqueQueryHandler(reviewRepository);
  const publishHandler = new PublishVerifiedReviewCommandHandler(
    reviewRepository,
    visitVerificationService
  );
  const canPublishHandler = new CanPublishReviewQueryHandler(visitVerificationService);

  // ── MESSAGING ──────────────────────────────────────────────────────────────
  const liaChatRepository = MOCK_FLAGS.messaging
    ? new MockLiaChatRepository()
    : new HttpLiaChatRepository();

  const sendHandler = new SendMessageToLiaCommandHandler(liaChatRepository);
  const getConversationHandler = new GetMyConversationQueryHandler(liaChatRepository);
  const getMessagesHandler = new GetConversationMessagesQueryHandler(liaChatRepository);
  const poller = new LiaResponsePoller(getMessagesHandler);

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
    business: {
      getHuariqueHandler,
      getHuariqueMenuHandler,
    },
    community: {
      addFavoriteHandler,
      removeFavoriteHandler,
      getFavoritesHandler,
      reviewsHandler,
      publishHandler,
      canPublishHandler,
    },
    messaging: {
      sendHandler,
      getConversationHandler,
      getMessagesHandler,
      poller,
    },
  };
}
