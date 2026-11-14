import { IHuariqueSummaryProvider } from '../domain/IHuariqueSummaryProvider.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';

// TODO: reemplazar por HttpBusinessSummaryAdapter cuando exista Business-Service.
// Hoy Business no tiene API: las tarjetas se arman con DEMO_HUARIQUES (ids h1…h10)
// cruzando por id lo que devuelve Radar, así que Radar debe tener cargados esos mismos ids.
export class BusinessCommunitySummaryAdapter extends IHuariqueSummaryProvider {
  async getSummaries(ids) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const catalog = new Map(DEMO_HUARIQUES.map((place) => [place.id, place]));
    return ids.map((id) => catalog.get(id)).filter(Boolean);
  }
}
