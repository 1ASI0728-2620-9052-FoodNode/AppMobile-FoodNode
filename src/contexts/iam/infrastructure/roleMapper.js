import { Roles } from '../domain/Role.js';

const BACKEND_TO_DOMAIN = Object.freeze({
  GASTRONOMIC_EXPLORER: Roles.GASTRONOMIC_EXPLORER,
  HUARIQUE_OWNER: Roles.HUARIQUE_OWNER,
  gastronomic_explorer: Roles.GASTRONOMIC_EXPLORER,

  huarique_owner: Roles.HUARIQUE_OWNER,

});

const DOMAIN_TO_BACKEND = Object.freeze({
  [Roles.GASTRONOMIC_EXPLORER]: 'GASTRONOMIC_EXPLORER',
  [Roles.HUARIQUE_OWNER]: 'HUARIQUE_OWNER',
});

export function toDomainRole(backendRole) {
  return BACKEND_TO_DOMAIN[backendRole] || Roles.GASTRONOMIC_EXPLORER;
}

export function toBackendRole(domainRole) {
  return DOMAIN_TO_BACKEND[domainRole] || 'GASTRONOMIC_EXPLORER';
}
