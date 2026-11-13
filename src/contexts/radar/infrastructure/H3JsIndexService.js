import { latLngToCell, gridDisk, cellToBoundary } from 'h3-js';
import { IH3IndexService } from '../domain/IH3IndexService.js';

const H3_RESOLUTION = 8;

export class H3JsIndexService extends IH3IndexService {
  cellOf(lat, lng) {
    return latLngToCell(lat, lng, H3_RESOLUTION);
  }

  gridDisk(cellIndex, k) {
    return gridDisk(cellIndex, k);
  }

  boundaryOf(cellIndex) {
    return cellToBoundary(cellIndex);
  }
}
