// Flags de funcionalidades. Viven fuera de shared/infrastructure para que también las
// pueda importar la capa de interfaces (ver las reglas de capas en .eslintrc.js).

// La pestaña "Rutas" (contexts/route) está fuera del alcance del informe:
// apagada salvo EXPO_PUBLIC_ENABLE_ROUTES=true.
export const ENABLE_ROUTES = process.env.EXPO_PUBLIC_ENABLE_ROUTES === 'true';
