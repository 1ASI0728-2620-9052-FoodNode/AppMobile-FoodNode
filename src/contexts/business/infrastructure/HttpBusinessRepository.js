import { IBusinessRepository } from '../domain/IBusinessRepository.js';
import { httpClient } from '../../../shared/infrastructure/httpClient.js';
import { toBusinessError, toHuarique, toMenu } from './businessMapper.js';

// Business-Service detrás del gateway: httpClient ya apunta a API_BASE_URL y envía el JWT de IAM.
export class HttpBusinessRepository extends IBusinessRepository {
  async getHuariqueById(huariqueId) {
    let response;
    try {
      response = await httpClient.get(`/business-api/huariques/${encodeURIComponent(huariqueId)}`);
    } catch (err) {
      throw toBusinessError(err);
    }
    return toHuarique(response.data);
  }

  async getMenuByHuariqueId(huariqueId) {
    let response;
    try {
      response = await httpClient.get(`/business-api/huariques/${encodeURIComponent(huariqueId)}/menu`);
    } catch (err) {
      throw toBusinessError(err);
    }
    return toMenu(response.data);
  }
}
