
import { describe, expect, jest, test } from '@jest/globals';
import { GetCoverageZoneQueryHandler } from '../GetCoverageZoneQueryHandler.js';

const CENTRAL = '882a100d2dfffff';
const NEIGHBOR_1 = '882a100d2d00000';
const NEIGHBOR_2 = '882a100d2d11111';

function createService() {
  return {
    cellOf: jest.fn().mockReturnValue(CENTRAL),
    gridDisk: jest.fn().mockReturnValue([
      CENTRAL,
      NEIGHBOR_1,
      NEIGHBOR_2,
    ]),
    boundaryOf: jest.fn().mockReturnValue([
      [-12.05, -77.05],
      [-12.06, -77.06],
    ]),
  };
}

describe('GetCoverageZoneQueryHandler', () => {

  test('debe identificar la celda central', () => {
    const service = createService();
    const handler = new GetCoverageZoneQueryHandler(service);

    const result = handler.execute(-12.05, -77.05);

    expect(result.centralCell).toBe(CENTRAL);
    expect(service.cellOf).toHaveBeenCalledWith(
      -12.05,
      -77.05
    );
  });

  test('debe obtener las celdas vecinas sin repetir la central', () => {
    const service = createService();
    const handler = new GetCoverageZoneQueryHandler(service);

    const result = handler.execute(-12.05, -77.05, 1);

    expect(result.neighborCells).toEqual([
      NEIGHBOR_1,
      NEIGHBOR_2,
    ]);

    expect(service.gridDisk).toHaveBeenCalledWith(
      CENTRAL,
      1
    );

    expect(Object.keys(result.boundaries)).toHaveLength(3);
  });

  test('debe permitir una zona sin celdas vecinas', () => {
    const service = createService();
    service.gridDisk.mockReturnValue([CENTRAL]);

    const handler = new GetCoverageZoneQueryHandler(service);
    const result = handler.execute(-12.05, -77.05, 0);

    expect(result.centralCell).toBe(CENTRAL);
    expect(result.neighborCells).toEqual([]);
    expect(Object.keys(result.boundaries)).toEqual([
      CENTRAL
    ]);
  });

});
