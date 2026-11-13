import { useState, useEffect, useCallback } from 'react';
import { useDependencies } from '../../../app/providers/DependencyProvider.jsx';
import { DEMO_MODE } from '../../../shared/demo/demoMode.js';

export function useRadar() {
  const container = useDependencies();
  const { locationProvider } = container.radar;

  const [huariques, setHuariques] = useState([]);
  const [coverageZone, setCoverageZone] = useState(null);
  const [h3Index, setH3Index] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationLabel, setLocationLabel] = useState('Mi ubicación');
  const [hasPermission, setHasPermission] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [userCoords, setUserCoords] = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let coords;
      if (DEMO_MODE) {
        coords = { latitude: -12.1403, longitude: -77.0219 };
        setHasPermission(true);
        setUserCoords(coords);
        setLocationLabel('Miraflores, Lima');
      } else {
        const granted = await locationProvider.requestPermission();
        setHasPermission(granted);

        if (!granted) {
          setIsLoading(false);
          return;
        }

        coords = await locationProvider.getCurrentCoordinates();
        setUserCoords(coords);

        const label = await locationProvider.reverseGeocode(coords);
        setLocationLabel(label);
      }

      const searchHandler = container.radar?.searchHandler;
      const coverageHandler = container.radar?.coverageHandler;

      const [searchResult, zone] = await Promise.all([
        searchHandler
          ? searchHandler.execute(coords.latitude, coords.longitude, 1)
          : Promise.resolve({ items: [], total: 0, isEmpty: true }),
        coverageHandler
          ? Promise.resolve(coverageHandler.execute(coords.latitude, coords.longitude, 1))
          : Promise.resolve(null),
      ]);

      setHuariques(searchResult.items ?? []);
      setCoverageZone(zone);
      if (zone?.centralCell) {
        setH3Index(zone.centralCell);
      }
    } catch (err) {
      setError(err?.message ?? 'Error al cargar el radar');
    } finally {
      setIsLoading(false);
    }
  }, [container, locationProvider]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  const filteredHuariques = huariques.filter((h) => {
    if (!filterText) return true;
    const text = filterText.toLowerCase();
    return (
      h.name?.toLowerCase().includes(text) ||
      h.cuisineType?.toLowerCase().includes(text)
    );
  });

  return {
    huariques,
    coverageZone,
    h3Index,
    isLoading,
    error,
    locationLabel,
    hasPermission,
    userCoords,
    refresh,
    filterText,
    setFilterText,
    filteredHuariques,
  };
}
