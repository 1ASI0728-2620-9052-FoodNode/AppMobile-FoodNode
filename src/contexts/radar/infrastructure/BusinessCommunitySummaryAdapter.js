import { IHuariqueSummaryProvider } from '../domain/IHuariqueSummaryProvider.js';
import { DEMO_HUARIQUES } from '../../../shared/demo/demoHuariques.js';

export class BusinessCommunitySummaryAdapter extends IHuariqueSummaryProvider {
  async getSummaries(ids) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const catalog = new Map(DEMO_HUARIQUES.map((place) => [place.id, place]));
    return ids.map((id) => catalog.get(id)).filter(Boolean);
  }
}
