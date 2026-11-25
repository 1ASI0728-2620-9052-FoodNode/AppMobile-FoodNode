# Prueba de punta a punta: IAM + Radar + Messaging

Checklist para verificar que la app móvil funciona contra los servicios reales. Lo que sigue en mock: Community y Reservation. Business ya tiene repositorio Http (`EXPO_PUBLIC_MOCK_BUSINESS=false`), pero ninguna pantalla lo consume todavía: se comprueba aparte (sección 4, Business).

## 1. Levantar el backend

Orden recomendado. Cada servicio en su propia terminal.

- [ ] **IAM** (`Foodly-IAM-Service`), puerto **8081**.
- [ ] **radar-service**, con el mismo `JWT_SECRET_BASE64` que IAM (JWT alineado, prompt B1).
  - Carga los huariques demo: `scripts/seed-demo-app.sh` (o `seed-demo-app.ps1` en Windows). Opción `--reset` para recargar desde cero (prompt B2).
- [ ] **messaging-service**, con el mismo `JWT_SECRET_BASE64` y `LIA_GATEWAY_MODE=stub` (Lía responde sin n8n).
- [ ] **Business** (`Foodly-Business-Service`), solo si vas a probar la sección 4, Business. Necesita MongoDB con replica set y RabbitMQ.
- [ ] **Gateway** (Kong) en el puerto **8000**: repo `foodly-infra` (`docker compose up -d`, ver su README). Reenvía a cada servicio por el puerto definido en su `.env`, así que arranca cada servicio con el `SERVER_PORT` que corresponda.

Comprobación rápida del gateway (opcional):

```bash
# Debe responder el servicio de IAM (un 400/401 sirve); no debe dar 404 de Kong ni "connection refused".
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/iam/auth/login
```

> Si IAM, radar y messaging no comparten la clave `JWT_SECRET_BASE64` (misma cadena Base64), todo token de IAM da **401** en radar y messaging.
>
> Aviso: en el código actual, radar y messaging leen `JWT_SECRET` como texto UTF-8, y IAM y Business decodifican la clave como Base64. Mientras eso no se alinee, los tokens de IAM pueden dar 401 en radar y messaging aunque la cadena sea la misma.

## 2. Configurar la app

1. Copia `.env.example` a `.env`.
2. Pon la URL del gateway según dónde corra la app:

   | Dónde | `EXPO_PUBLIC_API_BASE_URL` |
   |---|---|
   | Emulador de Android | `http://10.0.2.2:8000` |
   | Celular con Expo Go | `http://<IP de la PC en la red local>:8000` |

3. Activa el backend real:

   ```env
   EXPO_PUBLIC_DEMO_MODE=false
   EXPO_PUBLIC_MOCK_AUTH=false
   EXPO_PUBLIC_MOCK_RADAR=false
   EXPO_PUBLIC_MOCK_MESSAGING=false
   EXPO_PUBLIC_MOCK_BUSINESS=true
   EXPO_PUBLIC_MOCK_COMMUNITY=true
   EXPO_PUBLIC_MOCK_RESERVATION=true
   EXPO_PUBLIC_ENABLE_ROUTES=false
   ```

   | Variable | Valor por defecto | Efecto |
   |---|---|---|
   | `EXPO_PUBLIC_MOCK_BUSINESS` | `true` | `false` usa `HttpBusinessRepository` (`/business-api/...` por el gateway) |
   | `EXPO_PUBLIC_MOCK_COMMUNITY` | `true` | `false` usa los repositorios Http de `/community/*`. El servicio Community aún no existe: déjala en `true` |
   | `EXPO_PUBLIC_ENABLE_ROUTES` | `false` | `true` muestra la pestaña **Rutas**, la simulación de ruta y sus botones. Está fuera del alcance del informe |

   `DEMO_MODE=true` fuerza todos los mocks e ignora las banderas `MOCK_*`.

4. Inicia Expo con la caché limpia: `npx expo start -c`.

## 3. Fijar la ubicación del emulador en Barranco

Los huariques demo están en Barranco. Con el GPS real fuera de Barranco el radar sale **vacío** (con `DEMO_MODE=false` la app usa la ubicación del dispositivo).

En el emulador de Android: **Extended controls (`…`) → Location** → escribe:

- Latitude: `-12.1403`
- Longitude: `-77.0219`

→ **Set location**. Hazlo antes de abrir el radar (si ya estaba abierto, sal y vuelve a entrar, o usa **Reintentar**).

En un celular físico fuera de Barranco no se pueden ver los resultados, salvo que se cambie la ubicación con una app de ubicación simulada.

## 4. Checklist de la prueba

- [ ] **Registro**: en la app, regístrate como **explorador** (rol `GASTRONOMIC_EXPLORER`). Entras a las pestañas del explorador sin error.
- [ ] **Radar**: la pantalla del radar muestra los huariques **h1…h10** cerca de Barranco, con distancia. No aparece "ubicación inválida" ni "sesión expiró".
- [ ] **Detalle**: al tocar una tarjeta se abre el detalle (datos del catálogo demo).
- [ ] **Lía**: abre el chat desde el botón flotante del radar. Se carga el historial (vacío la primera vez).
- [ ] Escribe **"quiero un ceviche barato cerca"**. Aparece tu mensaje, luego "Lía está escribiendo…" y **llega la respuesta** (con `LIA_GATEWAY_MODE=stub`, en pocos segundos).
- [ ] Envía un segundo mensaje: se mantiene la **misma conversación** (no se crea otra).
- [ ] Cierra y vuelve a abrir el chat: el **historial** sigue ahí.
- [ ] **Pestañas**: el explorador ve Radar, Favoritos y Perfil. **Rutas** no aparece (con `EXPO_PUBLIC_ENABLE_ROUTES=true` reaparece). Las tarjetas del radar muestran solo "Ver Detalle" y el detalle solo "Reservar con Lía".
- [ ] **Business** (opcional, solo por el gateway; todavía no hay pantalla que lo muestre). Con el token que devuelve el login (`token` en la respuesta) y el `id` de un huarique registrado en Business:

  ```bash
  curl -s -H "Authorization: Bearer <token>" http://localhost:8000/business-api/huariques/<id>
  curl -s -H "Authorization: Bearer <token>" http://localhost:8000/business-api/huariques/<id>/menu
  ```

  Debe responder 200 (o 404 si el huarique o su carta no existen). Un 401 aquí significa que Business no acepta el JWT de IAM (issuer, audience o clave); con `MOCK_BUSINESS=false` la app cerraría la sesión.

## 5. Si algo falla

| Síntoma | Causa probable |
|---|---|
| Radar: "Tu sesión expiró…" / chat sin respuesta, 401 en el gateway | La clave JWT no coincide entre IAM y radar/messaging (`JWT_SECRET_BASE64`). Revisa el prompt B1. |
| Radar vacío | Ubicación fuera de Barranco (ver sección 3) o radar-service sin los huariques demo (`seed-demo-app`). |
| Radar con resultados pero sin tarjetas | Los ids que devuelve Radar no son `h1`…`h10`: la app cruza por id con el catálogo demo. |
| "No se pudo conectar con el servidor" | URL incorrecta (`10.0.2.2` solo sirve en el emulador), gateway apagado o firewall bloqueando el puerto 8000. |
| La app sigue mostrando datos simulados | `DEMO_MODE` quedó en `true`, o no reiniciaste con `npx expo start -c`. El chat con guion y "Chat y reservas simulados" indican modo mock. |
| La app te saca de la sesión al usar Business (`MOCK_BUSINESS=false`) | Business respondió 401: el JWT de IAM no cumple `iss`/`aud` o la clave no coincide. La app borra el token ante cualquier 401. Vuelve a `MOCK_BUSINESS=true` o alinea el contrato JWT. |
| Lía no responde en 30 s | messaging-service sin `LIA_GATEWAY_MODE=stub` y sin n8n. Tras ~20 s el backend envía un aviso de reserva manual, que también llega por polling. |
