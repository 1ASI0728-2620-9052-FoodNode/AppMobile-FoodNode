// Implements IVisitVerificationService
// TODO: integrate with reservation context to get real verified visit data
export class ReservationVisitAdapter {
  async getVerifiedVisit(reservationId) {
    // Mock implementation — always returns unverified
    // In production, this would query the reservation context
    return { verified: false, arrivedAt: null };
  }
}
