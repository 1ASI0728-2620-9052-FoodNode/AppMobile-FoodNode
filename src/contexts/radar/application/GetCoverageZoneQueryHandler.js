import { CoverageZone } from '../domain/CoverageZone.js';
import { H3Cell } from '../domain/H3Cell.js';

export class GetCoverageZoneQueryHandler {
  constructor(h3IndexService) {
    this._h3IndexService = h3IndexService;
  }

  execute(latitude, longitude, k = 1) {
    const centralIndex = this._h3IndexService.cellOf(latitude, longitude);
    const neighborIndexes = this._h3IndexService.gridDisk(centralIndex, k);

    const centralCell = H3Cell.create(centralIndex);
    const neighborCells = neighborIndexes
      .filter((idx) => idx !== centralIndex)
      .map((idx) => H3Cell.create(idx));

    const zone = CoverageZone.create(centralCell, neighborCells);

    const boundaries = {};
    for (const cell of zone.allCells) {
      boundaries[cell.index] = this._h3IndexService.boundaryOf(cell.index);
    }

    return {
      centralCell: centralIndex,
      neighborCells: neighborCells.map((c) => c.index),
      boundaries,
    };
  }
}
