export class GetHuariqueMenuQueryHandler {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }

  async execute({ huariqueId }) {
    return this.businessRepository.getMenuByHuariqueId(huariqueId);
  }
}
