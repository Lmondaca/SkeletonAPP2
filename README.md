# Skeleton App - Ionic Angular Application

Aplicación móvil de control de ingresos y gastos personales, desarrollada con Ionic, Angular y Angular Material, con una temática visual de esqueleto (paleta blanco/gris/negro).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (`^20.19.0`, `^22.12.0` o `>=24.0.0`, según requiere Angular CLI 20)
- [npm](https://www.npmjs.com/) (viene con Node.js)

## Instalación

1. Instalar Ionic CLI globalmente:
```bash
npm install -g @ionic/cli
```

2. Instalar las dependencias del proyecto:
```bash
npm install
```

## Comandos Disponibles

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:
```bash
ionic serve
```
Esto iniciará un servidor de desarrollo en `http://localhost:8100/`

### Construcción

Para construir la aplicación para producción:
```bash
ionic build --prod
```

### Testing

#### Pruebas unitarias (Jasmine + Karma)

```bash
npm test              # modo watch, abre Chrome
npm run test:ci       # una sola corrida, headless (usa Edge si no hay Chrome instalado)
```

Los servicios que dependen de SQLite nativo (`BdService`) se reemplazan por spies/mocks en los tests (ver `src/testing/sqlite-mock.ts`), ya que el plugin solo funciona en el dispositivo/emulador real.

#### Pruebas end-to-end (Cypress)

```bash
npm run e2e           # abre la UI interactiva de Cypress
npm run e2e:run       # corre todos los specs en modo headless (Edge)
```

Cypress apunta a `http://localhost:4200` (ver `cypress.config.ts`), así que la app debe estar corriendo en ese puerto antes de ejecutar los tests:
```bash
ionic serve --port 4200
```

Los specs (`cypress/e2e/*.cy.ts`) cubren login, perfil, movimiento, movimientos, auto-movi, auto-movimientos y resumen. Como SQLite nativo no existe al correr en el navegador, estos tests validan el comportamiento real y observable en ese entorno (validaciones de formulario, guards de rutas, filtros, mensajes de error esperados por la falta de base de datos), no el flujo completo de persistencia — eso requiere un dispositivo/emulador nativo.

## Flujo de la Aplicación

1. **Login** (`/login`) - ingreso de usuario (alfanumérico, 3 a 8 caracteres) y contraseña (numérica, 4 dígitos). Las credenciales se validan contra la base de datos SQLite. Incluye acceso a Registro.
2. **Registro** (`/registro`) - formulario de registro básico (nombre, apellido, usuario, contraseña y confirmación); guarda el usuario en SQLite y, al validar los campos, redirige a Login.
3. **Home** (`/home`) - página de bienvenida tras iniciar sesión, con acceso directo a las demás páginas.
4. **Perfil** (`/perfil`) - formulario de datos adicionales del usuario (nombre, apellido, nivel de educación, fecha de nacimiento); persiste en SQLite y carga los datos guardados al entrar a la página.
5. **Movimiento** (`/movimiento`) - registro manual de un movimiento financiero (descripción, monto, tipo débito/crédito, fecha de movimiento); persiste en SQLite asociado al usuario en sesión.
6. **Movimientos** (`/movimientos`) - listado de movimientos manuales desde SQLite, con filtro por rango de fechas, totales de créditos/débitos y opción de eliminar cada registro.
7. **Auto-Movi** (`/auto-movi`) - registro de movimientos automáticos recurrentes (sueldos, suscripciones, seguros, dividendos), con frecuencia mensual/anual y fecha de factura; persiste en SQLite.
8. **Movimientos Automáticos** (`/auto-movimientos`) - listado de movimientos automáticos desde SQLite, con filtro por rango de fechas, totales de créditos/débitos y opción de eliminar cada registro.
9. **Resumen** (`/resumen`) - resumen combinado de movimientos manuales y automáticos (leídos desde SQLite), con totales de ingresos, cobros y balance, filtrable por mes.
10. **404 / Not Found** (`/not-found`) - página de error para cualquier ruta no configurada (redirección automática desde `**`).

Todas las páginas posteriores al login incluyen un menú lateral (☰) para navegar entre ellas y cerrar sesión.

### Autenticación y persistencia de sesión

- Las credenciales ingresadas en Login se validan contra la tabla `usuarios` de la base de datos SQLite (creada y gestionada por `BdService`).
- El usuario autenticado se guarda en `UsuarioService`, respaldado en `localStorage`, por lo que la sesión **sobrevive a un refresh** de la aplicación.
- Un `authGuard` (route guard funcional) protege las rutas `home`, `perfil`, `movimiento`, `movimientos`, `auto-movi`, `auto-movimientos` y `resumen`: si no hay un usuario en sesión, redirige automáticamente a `/login`. Las rutas `login`, `registro` y `not-found` quedan siempre accesibles.
- Cerrar sesión limpia el usuario de `UsuarioService` (y por lo tanto de `localStorage`) y redirige a Login.

> **Nota:** SQLite (vía `@awesome-cordova-plugins/sqlite` + `cordova-sqlite-storage`) solo funciona en el dispositivo/emulador nativo (Android/iOS). Al correr con `ionic serve` en el navegador, `BdService` detecta la ausencia del entorno Cordova y omite la inicialización de la base de datos.

### Persistencia de datos (SQLite)

`BdService` (`src/app/services/bd.service.ts`) centraliza el acceso a la base de datos `skeletonapp.db` y crea, si no existen, las siguientes tablas:

- **`usuarios`** - credenciales registradas (`nombre`, `apellido`, `usuario` único, `contraseña`).
- **`perfiles`** - datos adicionales del usuario (uno por `usuario`, con upsert).
- **`movimientos`** - movimientos manuales, asociados al `usuario` que los creó.
- **`auto_movimientos`** - movimientos automáticos recurrentes, asociados al `usuario` que los creó.

Todas las páginas de listado (Movimientos, Movimientos Automáticos) permiten eliminar un registro individual con confirmación previa.

### Generación automática de movimientos (`AutoMoviProcesadorService`)

`AutoMoviProcesadorService` (`src/app/services/auto-movi-procesador.service.ts`) revisa los `auto_movimientos` del usuario y, por cada uno cuya `fecha_factura` ya venció, crea el `Movimiento` correspondiente y avanza la fecha de factura según la `frecuencia` (mensual/anual). Si la app estuvo cerrada por más de un periodo, genera todos los movimientos atrasados en una sola pasada ("catch-up").

Como Capacitor no incluye un scheduler nativo de tareas en segundo plano, esta verificación se ejecuta en los momentos de actividad de sesión en lugar de "una vez al día" en estricto rigor:
- Al iniciar sesión exitosamente (`login.page.ts`).
- Al arrancar la app con una sesión ya persistida en `localStorage` (`app.component.ts`).

### Consumo de APIs (base genérica)

El proyecto incluye una base lista para consumir servicios HTTP externos en el futuro:

- `HttpClient` está habilitado globalmente en `AppModule` mediante `provideHttpClient()` (reemplazo moderno de `HttpClientModule`).
- `ApiService` (`src/app/services/api.service.ts`) expone métodos genéricos `get`, `post`, `put` y `delete`, tipados con generics y construidos sobre `environment.apiUrl`.
- `environment.apiUrl` (en `src/environments/environment.ts` y `environment.prod.ts`) centraliza la URL base de la API; hoy es un valor de ejemplo (`https://api.example.com`) que debe reemplazarse cuando exista un backend real.

Para consumir un endpoint desde cualquier página o servicio, basta con inyectar `ApiService` y llamar, por ejemplo, `this.apiService.get<MiTipo>('recurso')`.

#### Pendiente: valor del dólar (API externa en Python)

Está planificada una integración con una API propia en Python (fuera de este repositorio) que consulta al Banco Central y expone el valor diario del dólar. Esa API oculta las credenciales del Banco Central y cachea el valor de su lado para hacer una sola consulta externa por día; la app solo le pega a un endpoint simple (ej. `GET /dolar`).

Del lado de esta app quedaron marcados los puntos de extensión con TODOs, sin implementación aún:
- `bd.service.ts` - TODO de la tabla `valor_dolar` (`fecha` como `PRIMARY KEY`, `valor`) para cachear el valor localmente y evitar llamadas repetidas el mismo día.
- `dolar.service.ts` - servicio nuevo (vacío salvo TODOs) que orquestará: revisar caché de hoy en `BdService`, si no existe llamar a `ApiService`, persistir y retornar el valor.
- `environment.ts` / `environment.prod.ts` - `apiUrl` deberá apuntar a la URL real de esa API una vez desplegada.

## Estructura del Proyecto

- `src/app/` - Contiene los componentes principales de la aplicación
  - `login/` - Inicio de sesión (valida credenciales contra SQLite)
  - `registro/` - Registro de nuevo usuario (persiste en SQLite)
  - `home/` - Página principal y menú de navegación
  - `perfil/` - Datos adicionales del usuario
  - `movimiento/` - Registro manual de movimientos
  - `movimientos/` - Listado, filtro y eliminación de movimientos manuales
  - `auto-movi/` - Registro de movimientos automáticos
  - `auto-movimientos/` - Listado, filtro y eliminación de movimientos automáticos
  - `resumen/` - Resumen de ingresos, cobros y balance
  - `not-found/` - Página 404
  - `guards/` - `authGuard`, guarda de rutas basada en la sesión activa
  - `services/` - Servicios compartidos: `UsuarioService` (sesión), `BdService` (SQLite: usuarios, perfiles, movimientos, auto_movimientos), `AutoMoviProcesadorService` (generación automática de movimientos vencidos), `ApiService` (consumo de APIs HTTP), `DolarService` (pendiente, ver sección de API del dólar)
- `src/assets/` - Recursos estáticos (íconos e imágenes)
- `src/environments/` - Configuraciones de entorno
- `src/theme/` - Estilos globales y variables (paleta blanco/gris/negro)
- `src/testing/` - Mocks compartidos para las pruebas unitarias (ej. `sqlite-mock.ts`)
- `cypress/e2e/` - Pruebas end-to-end (una por página)
- `android/` - Proyecto nativo de Android generado por Capacitor (`npx cap add android`)

## Dependencias Destacadas

- `@ionic/angular` - Componentes de interfaz móvil
- `@angular/material` - Selector de fechas (`MatDatepicker`), usado en Perfil, Movimiento, Movimientos, Auto-Movi y Resumen
- `@awesome-cordova-plugins/sqlite` + `cordova-sqlite-storage` - Persistencia nativa de usuarios registrados y validación de credenciales (solo en dispositivo/emulador nativo)
- `@capacitor/android` - Plataforma nativa de Android

## Configuración Adicional

La configuración principal de la aplicación se encuentra en:
- `angular.json` - Configuración de Angular
- `capacitor.config.ts` - Configuración de Capacitor
- `ionic.config.json` - Configuración de Ionic
