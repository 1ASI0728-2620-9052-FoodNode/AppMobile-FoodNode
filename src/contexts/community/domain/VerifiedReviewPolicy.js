export class VerifiedReviewPolicy {
  canPublish(reservation) {
    if (!reservation) return false;
    if (reservation.status?.value !== 'APPROVED' && reservation.status !== 'APPROVED') return false;
    if (!reservation.arrivedAt) return false;
    return true;
  }
}
