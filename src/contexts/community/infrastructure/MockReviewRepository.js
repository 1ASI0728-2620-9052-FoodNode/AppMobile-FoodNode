const SEED_DATA = [
  {
    id: 'rv1',
    huariqueId: 'h2',
    explorerName: 'Mario Palacios',
    rating: 5,
    comment: 'El trío marino no tiene pierde. El ají limo bien picado y la chicha morada recién hervida. Volveré con la familia este domingo.',
    photoUri: null,
    verified: true,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'rv2',
    huariqueId: 'h2',
    explorerName: 'Valeria Castro',
    rating: 4,
    comment: 'Recomiendo llegar antes de la 1:30 PM porque la causa de cangrejo vuela. Atención rápida y muy de barrio tradicional.',
    photoUri: null,
    verified: true,
    createdAt: new Date(Date.now() - 3 * 86400000),
  },
  {
    id: 'rv3',
    huariqueId: 'h1',
    explorerName: 'Carlos Mendoza',
    rating: 5,
    comment: 'La Concha es el lugar perfecto para un almuerzo dominical. Los anticuchos de corazón tienen el punto exacto de ají panca. Imperdible.',
    photoUri: null,
    verified: true,
    createdAt: new Date(Date.now() - 7 * 86400000),
  },
];

export class MockReviewRepository {
  constructor() {
    this._reviews = [...SEED_DATA];
  }

  async getByHuariqueId(huariqueId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this._reviews.filter((r) => r.huariqueId === huariqueId);
  }

  async publish(reviewData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this._reviews.unshift({ ...reviewData });
    return reviewData;
  }
}
