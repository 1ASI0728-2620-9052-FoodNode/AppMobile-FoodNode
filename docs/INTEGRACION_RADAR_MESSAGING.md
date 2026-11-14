# Integración de Radar y Messaging con la app móvil (AppMobile-FoodNode)

Revisado el 13/11/2026 sobre la rama `develop` de los repos de la organización `1ASI0728-2620-9052-FoodNode`.

> **Estado en este repo (rama `feature/radar-messaging-integration`):** los prompts F1 (Radar), F2 (Messaging/Lía) y F3 (configuración y prueba E2E) están aplicados. Los prompts B1, B2 y G1 son para otros repos (radar-service, messaging-service y `foodly-gateway`). Prueba de punta a punta: [PRUEBA_E2E.md](PRUEBA_E2E.md).

## Qué encontré en los repos

| Repo | Estado |
|---|---|
| **AppMobile-FoodNode** (React Native + Expo 58, rama `develop`) | Ya tiene los contextos `radar` y `messaging`, con un repositorio Mock y uno Http cada uno. La selección se hace con banderas en `.env`. Solo IAM está conectado al backend real (PR #1 de Fabricio). |
| **Foodly-IAM-Service** (rama `develop`) | JWT **HS256** con la clave en **Base64** (`JWT_SECRET_BASE64`, que se decodifica a bytes), `sub` = id del usuario (UUID), claim **`role`** = `GASTRONOMIC_EXPLORER` / `HUARIQUE_OWNER`, 60 min de expiración, puerto **8081**, rutas `/iam/auth/*` y `/iam/users/me`. |
| **Foodly-Business-Service** | Solo tiene el README: todavía no hay API. Por eso la app arma las tarjetas del radar con datos demo (`DEMO_HUARIQUES`, ids `h1`…`h10`). |
| **Foodly-Reservation-Service** | Recién inicializado (2 clases). |
| Gateway (Kong) | No existe en ningún repo. La app apunta a **una sola URL**: `EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000`, el puerto por defecto de Kong. |
| App web en Vue | No hay repo todavía. Por ahora "el front" es la app móvil. |

## Por qué hoy no funcionaría aunque apagues los mocks

1. **Messaging no está conectado en la app.** `src/app/container.js` no tiene el bloque `messaging`, y `useLia` hace `container.messaging?.…`, así que el chat nunca llama al backend.
2. **La respuesta del radar tiene otra forma.** La app espera un arreglo `[{ id, coordinates, distanceMeters }]`, pero el servicio devuelve `{ huariques: [{ huariqueId, latitude, longitude, distanceMeters }], total }`.
3. **Los ids no coinciden.** Las tarjetas se arman cruzando con `DEMO_HUARIQUES` por id (`h1`…`h10`). Si Radar devuelve otros ids, la lista sale vacía.
4. **El chat tiene otro contrato.**
   - La app manda `{ content, coordinates: { latitude, longitude } }` y la API espera `latitude` y `longitude` sueltos.
   - `GET /messaging/conversations/me` devuelve una **lista**, pero la app espera **una** conversación.
   - La primera vez no hay conversación: la app usa `'default-conv'` y no guarda el `conversationId` que devuelve el `POST /messaging/chat`.
   - `intentType` y `reservationId` no se mapean en `MessageDto`.
5. **La firma JWT puede no coincidir.** IAM decodifica la clave desde Base64. Si radar y messaging usan `JWT_SECRET` como texto plano, todo token de IAM da 401.
6. **No hay gateway.** La app tiene una sola base URL, así que hace falta un Kong local que enrute `/iam`, `/radar` y `/messaging`.

## Orden de trabajo

1. **B1:** alinear el JWT en radar-service y messaging-service.
2. **B2:** cargar en Radar los huariques demo (`h1`…`h10`).
3. **G1:** levantar Kong local.
4. **F1, F2 y F3:** integrar la app en una rama `feature/radar-messaging-integration` y abrir un PR a `develop`.

---

## PROMPT B1: alinear el JWT con IAM (pegar en radar-service y luego en messaging-service)

```
IAM (repo Foodly-IAM-Service, clase JwtTokenIssuer) firma el JWT así:
- HS256 con jjwt: Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretBase64)), propiedad foodly.jwt.secret-base64 = ${JWT_SECRET_BASE64}
- subject = id del usuario (UUID en texto); claim "role" = GASTRONOMIC_EXPLORER | HUARIQUE_OWNER; expiración de 60 min; sin issuer.

Ajusta este servicio para validar exactamente esos tokens:
1. La clave se lee de JWT_SECRET_BASE64 y se decodifica desde Base64 (mínimo 32 bytes). Deja JWT_SECRET solo como alias de compatibilidad, si ya existía.
2. No exijas issuer si el token no lo trae (JWT_ISSUER opcional).
3. El claim del rol es "role" y el id de usuario es "sub".
4. Actualiza scripts/dev-token.* para que firme igual que IAM (Base64), así sus tokens y los de IAM son intercambiables.
5. Agrega una prueba que valide un token generado con la misma lógica que JwtTokenIssuer.
6. Actualiza README, docker-compose, .env.example y DEVIATIONS.md (fila: "JWT alineado con Foodly-IAM-Service").
Ejecuta mvnw.cmd test.
```

## PROMPT B2: huariques demo en Radar (solo radar-service)

```
Mientras no exista Business-Service, la app móvil arma las tarjetas del radar con DEMO_HUARIQUES (ids h1…h10) y cruza por id lo que devuelve Radar.

Crea scripts/seed-demo-app.sh (y su versión .ps1) que publique 10 eventos HuariqueRegistered con los MISMOS ids y coordenadas que AppMobile-FoodNode/src/shared/demo/demoHuariques.js (los copio abajo).
- Usa version 1, status ACTIVE si isOpen es true y INACTIVE si no.
- Agrega la opción --reset.
- Documenta en el README que esto es temporal hasta que Business publique eventos reales.

[PEGA AQUÍ el contenido de demoHuariques.js, o solo id + coordinates + isOpen de cada uno]
```

## PROMPT G1: gateway Kong local (carpeta nueva `foodly-gateway`, junto a los servicios)

```
Crea un gateway local con Kong en modo DB-less para que la app móvil use una sola URL (puerto 8000), igual que en el diseño (Kong como punto de entrada único):
- docker-compose.yml con kong:3 (KONG_DATABASE=off, KONG_DECLARATIVE_CONFIG=/kong/kong.yml) y los puertos 8000 (proxy) y 8001 (admin, solo 127.0.0.1).
- kong.yml con un servicio y una ruta por contexto, strip_path: false:
  /iam       -> http://host.docker.internal:8081
  /radar     -> http://host.docker.internal:<puerto de radar-service>
  /messaging -> http://host.docker.internal:<puerto de messaging-service>
  (lee los puertos reales en los application.yml de ../radar-service y ../messaging-service)
- Incluye la ruta de WebSocket /messaging/ws (protocols http/https; Kong hace el upgrade).
- Plugin cors en modo abierto solo para desarrollo (sirve si prueban con expo web).
- README con cómo levantarlo y cómo probarlo con curl: login en IAM → token → POST /radar/search → POST /messaging/chat.
- En Linux, extra_hosts: host.docker.internal:host-gateway.
```

---

## Prompts para la app (repo AppMobile-FoodNode)

### PROMPT F1: Radar

```
Lee AGENTS.md y docs/INTEGRACION_RADAR_MESSAGING.md.
Ojo: este proyecto usa React Navigation, NO Expo Router; no migres la navegación. No agregues dependencias nuevas.

Integra el contexto radar con el backend real (radar-service), sin romper el modo mock:
1. HttpRadarRepository.searchNearby: POST /radar/search { latitude, longitude, kRing } y mapea la respuesta
   { huariques: [{ huariqueId, latitude, longitude, distanceMeters }], total }
   al mismo formato que devuelve MockRadarRepository: [{ id: huariqueId, coordinates: { lat: latitude, lng: longitude }, distanceMeters }].
   El mapeo va en una función aparte (radarMapper.js) con su prueba en Jest.
2. Lista vacía (200 con total 0) → []. Errores 400/401/5xx → error con un mensaje en español que useRadar pueda mostrar.
3. Deja BusinessCommunitySummaryAdapter como está (Business aún no tiene API), pero con un comentario TODO que diga que se reemplaza por HttpBusinessSummaryAdapter cuando exista Business-Service.
4. Documenta en .env.example que, para usar el radar real, hay que poner EXPO_PUBLIC_DEMO_MODE=false y EXPO_PUBLIC_MOCK_RADAR=false (DEMO_MODE=true fuerza todos los mocks).
Ejecuta npm test y npx expo lint.
```

### PROMPT F2: Messaging (Lía)

```
Integra el contexto messaging con messaging-service. Hoy no está conectado: container.js no tiene el bloque messaging y useLia usa container.messaging?.… con 'default-conv'.

Contrato real del backend:
- POST /messaging/chat { content, conversationId?, latitude?, longitude? } → 202 { conversationId, messageId, status: "PROCESSING" }
- GET /messaging/conversations/me → ConversationResource[] (puede venir vacío)
- GET /messaging/conversations/{id}/messages → [{ id, sender: "EXPLORER"|"LIA", content, intentType, huariqueId, reservationId, sentAt }]
- La respuesta de Lía llega de forma asíncrona (n8n); se obtiene con polling a los mensajes. También hay STOMP en /messaging/ws, pero en esta iteración usamos polling.

Cambios:
1. HttpLiaChatRepository:
   - sendMessage(content, coordinates, conversationId) aplana coordinates a latitude/longitude, envía conversationId si existe y DEVUELVE { conversationId, messageId };
   - getMyConversation() devuelve la conversación ACTIVE de la lista (o la más reciente), o null si no hay;
   - getMessages sin cambios.
   Ajusta ILiaChatRepository y MockLiaChatRepository a la misma firma.
2. Nuevo GetMyConversationQueryHandler. SendMessageToLiaCommandHandler devuelve { conversationId, messageId }.
3. MessageDto.fromRaw también mapea intentType → detectedIntent y reservationId → reservationRef.
4. container.js: bloque messaging = { sendHandler, getConversationHandler, getMessagesHandler }, con Mock o Http según MOCK_FLAGS.messaging.
5. useLia:
   - si getMyConversation devuelve null, no uses 'default-conv': el conversationId se toma de la respuesta del primer envío y se reutiliza;
   - carga el historial al abrir el chat;
   - mantiene el polling cada 1,5 s hasta 30 s (el timeout de Lía en el backend es de unos 20 s y luego llega un aviso de reserva manual);
   - quita el corte fijo de 8 s;
   - reemplaza el mensaje optimista por el real cuando llegue.
6. Envía las coordenadas del usuario si ya se tienen (las usa Lía para recomendar cerca).
7. Pruebas en Jest para el mapper, los handlers y el flujo de conversationId.
Ejecuta npm test y npx expo lint.
```

### PROMPT F3: Configuración y prueba de punta a punta

```
1. Actualiza .env.example y el README con dos escenarios:
   - Emulador de Android: EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000.
   - Celular con Expo Go: EXPO_PUBLIC_API_BASE_URL=http://<IP de la PC en la red local>:8000.
   En ambos: EXPO_PUBLIC_DEMO_MODE=false, MOCK_AUTH=false, MOCK_RADAR=false y MOCK_MESSAGING=false; los demás mocks quedan en true.
2. Agrega docs/PRUEBA_E2E.md con la checklist: levantar IAM, radar-service (más seed-demo-app), messaging-service (LIA_GATEWAY_MODE=stub) y foodly-gateway → registrarse como explorador → radar muestra h1…h10 cerca de Barranco → abrir Lía → "quiero un ceviche barato cerca" → llega la respuesta.
   Incluye cómo fijar la ubicación del emulador en -12.1403, -77.0219 (Extended controls → Location), porque con GPS real fuera de Barranco el radar sale vacío.
3. No cambies nada de IAM ni de las otras pantallas.
```

---

## Para el PR a `develop`

- **Título:** `feat: integración de Radar y Messaging con backend`.
- **Descripción:** qué se conectó, cómo probar (enlace a `docs/PRUEBA_E2E.md`) y qué sigue en mock (Business, Community, Reservation).
- **Ojo:** el repo tiene la pantalla **Rutas** (`contexts/route`), pero el informe declara las rutas **fuera de alcance**. Comentarlo con el equipo; no es parte de tu integración.
