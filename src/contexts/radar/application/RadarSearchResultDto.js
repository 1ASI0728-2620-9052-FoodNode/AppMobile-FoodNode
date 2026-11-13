export class RadarSearchResultDto {
  static fromDomain(searchResult) {
    return {
      items: searchResult.items.map((item) => ({ ...item })),
      total: searchResult.total,
      isEmpty: searchResult.isEmpty(),
    };
  }
}
