export class GetHuariqueByIdQueryHandler {
  constructor(businessRepository) {
    this.businessRepository = businessRepository;
  }

  async execute({ huariqueId }) {
    return this.businessRepository.getHuariqueById(huariqueId);
  }
}
