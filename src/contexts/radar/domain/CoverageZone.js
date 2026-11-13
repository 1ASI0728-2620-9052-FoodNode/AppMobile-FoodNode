import { ValueObject } from '../../../shared/kernel/ValueObject.js';

export class CoverageZone extends ValueObject {
  constructor(centralCell, neighborCells) {
    super();
    this.centralCell = centralCell;
    this.neighborCells = neighborCells;
    Object.freeze(this);
  }

  static create(centralCell, neighborCells) {
    return new CoverageZone(centralCell, neighborCells);
  }

  get allCells() {
    return [this.centralCell, ...this.neighborCells];
  }

  containsCell(cellIndex) {
    return this.allCells.some((c) => c.index === cellIndex);
  }
}
