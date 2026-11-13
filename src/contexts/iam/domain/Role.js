import { ValueObject } from '../../../shared/kernel/ValueObject.js';
import { DomainError } from '../../../shared/kernel/DomainError.js';

export const Roles = Object.freeze({
  GASTRONOMIC_EXPLORER: 'GASTRONOMIC_EXPLORER',
  HUARIQUE_OWNER: 'HUARIQUE_OWNER',
});

const VALID_ROLES = Object.values(Roles);

export class Role extends ValueObject {
  constructor(value) {
    super();
    this.value = value;
  }

  static create(value) {
    if (!value || !VALID_ROLES.includes(value)) {
      throw new DomainError(
        `Rol inválido. Debe ser uno de: ${VALID_ROLES.join(', ')}`,
        'INVALID_ROLE',
      );
    }
    const instance = new Role(value);
    return Object.freeze(instance);
  }

  isExplorer() {
    return this.value === Roles.GASTRONOMIC_EXPLORER;
  }

  isOwner() {
    return this.value === Roles.HUARIQUE_OWNER;
  }

  toString() {
    return this.value;
  }
}
