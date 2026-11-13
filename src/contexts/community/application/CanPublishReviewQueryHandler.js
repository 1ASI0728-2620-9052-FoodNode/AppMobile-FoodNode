export class CanPublishReviewQueryHandler {
  constructor(visitVerificationService) {
    this.visitVerificationService = visitVerificationService;
  }

  async execute({ reservationId }) {
    const visit = await this.visitVerificationService.getVerifiedVisit(reservationId);
    return { canPublish: visit.verified === true };
  }
}
