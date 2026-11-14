/**
 * Mapea la respuesta de radar-service al formato interno de la app.
 *
 * Backend:  { huariques: [{ huariqueId, latitude, longitude, distanceMeters }], total }
 * App:      [{ id, coordinates: { lat, lng }, distanceMeters }]
 *
 * Es el mismo formato que devuelve MockRadarRepository.
 */
export function mapRadarSearchResponse(data) {
  const huariques = Array.isArray(data?.huariques) ? data.huariques : [];
  return huariques.map((item) => ({
    id: item.huariqueId,
    coordinates: { lat: item.latitude, lng: item.longitude },
    distanceMeters: item.distanceMeters,
  }));
}

/**
 * Convierte un error de axios en un Error con mensaje en español
 * que useRadar puede mostrar tal cual.
 */
export function toRadarError(err) {
  const status = err?.response?.status;
  let message;

  if (status === 400) {
    message = 'La ubicación enviada no es válida. Intenta actualizar tu posición.';
  } else if (status === 401) {
    message = 'Tu sesión expiró. Inicia sesión de nuevo para ver el radar.';
  } else if (status >= 500) {
    message = 'El servicio de radar no está disponible en este momento. Intenta más tarde.';
  } else if (!err?.response) {
    message = 'No se pudo conectar con el servidor. Revisa tu conexión.';
  } else {
    message = 'No se pudo cargar el radar. Intenta de nuevo.';
  }

  const error = new Error(message);
  error.status = status ?? null;
  error.cause = err;
  return error;
}
