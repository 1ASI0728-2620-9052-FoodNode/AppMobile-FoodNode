/**
 * Puerto de lectura del contexto Business (huariques y cartas).
 *
 * Implementaciones: HttpBusinessRepository (gateway) y MockBusinessRepository (modo demo).
 */
export class IBusinessRepository {
  /**
   * @param {string} huariqueId
   * @returns {Promise<object>} perfil del huarique (ver businessMapper.toHuarique)
   */
  async getHuariqueById(_huariqueId) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} huariqueId
   * @returns {Promise<import('./Menu.js').Menu>} carta del huarique
   */
  async getMenuByHuariqueId(_huariqueId) {
    throw new Error('Not implemented');
  }
}
