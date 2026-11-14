# Foodly — AppMobile-FoodNode

App móvil de Foodly (React Native + Expo, navegación con React Navigation). Arquitectura por contextos (`src/contexts/*`: `iam`, `radar`, `messaging`, …) con capas `domain` / `application` / `infrastructure` / `interfaces`.

## Requisitos

- Node.js y npm
- Android Studio (emulador) **o** la app Expo Go en un celular

## Puesta en marcha

```bash
npm install
cp .env.example .env     # en Windows CMD: copy .env.example .env
npx expo start -c        # -c limpia la caché para que tome las variables nuevas
```

## Configuración: modo demo o backend real

La app lee su configuración de `.env` (`EXPO_PUBLIC_*`). Hay dos escenarios; la lista completa de variables está comentada en [.env.example](.env.example).

### Escenario A — Demo (por defecto)

`EXPO_PUBLIC_DEMO_MODE=true`: todo simulado, sin backend. La ubicación se fija en Miraflores.

### Escenario B — Backend real (IAM + Radar + Messaging)

La app apunta a **una sola URL**, el gateway Kong (puerto 8000), que enruta `/iam`, `/radar` y `/messaging`.

| Dónde corre la app | `EXPO_PUBLIC_API_BASE_URL` |
|---|---|
| Emulador de Android | `http://10.0.2.2:8000` |
| Celular con Expo Go | `http://<IP de la PC en la red local>:8000` (ej. `http://192.168.1.50:8000`) |

En ambos casos:

```env
EXPO_PUBLIC_DEMO_MODE=false
EXPO_PUBLIC_MOCK_AUTH=false
EXPO_PUBLIC_MOCK_RADAR=false
EXPO_PUBLIC_MOCK_MESSAGING=false
EXPO_PUBLIC_MOCK_BUSINESS=true
EXPO_PUBLIC_MOCK_COMMUNITY=true
EXPO_PUBLIC_MOCK_RESERVATION=true
```

> `DEMO_MODE=true` **fuerza todos los mocks** e ignora las banderas `MOCK_*`. Para usar el radar o el chat reales hay que poner `DEMO_MODE=false` **y** la bandera del contexto en `false`.

Con el celular, la PC y el celular deben estar en la misma red y el firewall debe permitir el puerto 8000.

Prueba de punta a punta: [docs/PRUEBA_E2E.md](docs/PRUEBA_E2E.md). Contexto de la integración: [docs/INTEGRACION_RADAR_MESSAGING.md](docs/INTEGRACION_RADAR_MESSAGING.md).

## Qué está conectado al backend

| Contexto | Estado | Bandera |
|---|---|---|
| IAM (login, registro) | Real | `MOCK_AUTH` |
| Radar (`POST /radar/search`) | Real | `MOCK_RADAR` |
| Messaging / Lía (`/messaging/chat`, conversaciones) | Real, con polling | `MOCK_MESSAGING` |
| Business, Community, Reservation | Mock (aún no hay API) | `MOCK_BUSINESS`, `MOCK_COMMUNITY`, `MOCK_RESERVATION` |

Las tarjetas del radar se arman cruzando por id lo que devuelve Radar con el catálogo demo (`src/shared/demo/demoHuariques.js`, ids `h1`…`h10`), hasta que exista Business-Service.

## Pruebas

```bash
npm test
```

Ejecuta las pruebas de Jest de las capas `domain`, `application`, `infrastructure`, `kernel` y `demo`.
