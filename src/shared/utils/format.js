export function formatPrice(amount, currency = 'S/') {
  return `${currency} ${Number(amount).toFixed(0)}`;
}
export function formatPriceRange(min, max, currency = 'S/') {
  return `${currency} ${min} - ${max}`;
}
export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}
export function formatTime(date) {
  return new Date(date).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
}
export function formatWalkingTime(minutes) {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  return `${Math.floor(minutes / 60)}h ${Math.round(minutes % 60)}min`;
}

