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

Para ejecutar las pruebas unitarias:
```bash
ng test
```

## Flujo de la Aplicación

1. **Login** (`/login`) - ingreso de usuario (alfanumérico, 3 a 8 caracteres) y contraseña (numérica, 4 dígitos). Las credenciales se validan contra la base de datos SQLite. Incluye acceso a Registro.
2. **Registro** (`/registro`) - formulario de registro básico (nombre, apellido, usuario, contraseña y confirmación); guarda el usuario en SQLite y, al validar los campos, redirige a Login.
3. **Home** (`/home`) - página de bienvenida tras iniciar sesión, con acceso directo a las demás páginas.
4. **Perfil** (`/perfil`) - formulario de datos adicionales del usuario (nombre, apellido, nivel de educación, fecha de nacimiento).
5. **Movimiento** (`/movimiento`) - registro manual de un movimiento financiero (descripción, monto, tipo débito/crédito, fecha de movimiento).
6. **Movimientos** (`/movimientos`) - listado de movimientos manuales, con filtro por rango de fechas y totales de créditos/débitos.
7. **Auto-Movi** (`/auto-movi`) - registro de movimientos automáticos recurrentes (sueldos, suscripciones, seguros), con frecuencia mensual/anual y fecha de factura.
8. **Resumen** (`/resumen`) - resumen combinado de movimientos manuales y automáticos, con totales de ingresos, cobros y balance, filtrable por mes.
9. **404 / Not Found** (`/not-found`) - página de error para cualquier ruta no configurada (redirección automática desde `**`).

Todas las páginas posteriores al login incluyen un menú lateral (☰) para navegar entre ellas y cerrar sesión.

### Autenticación y persistencia de sesión

- Las credenciales ingresadas en Login se validan contra la tabla `usuarios` de la base de datos SQLite (creada y gestionada por `BdService`).
- El usuario autenticado se guarda en `UsuarioService`, respaldado en `localStorage`, por lo que la sesión **sobrevive a un refresh** de la aplicación.
- Un `authGuard` (route guard funcional) protege las rutas `home`, `perfil`, `movimiento`, `movimientos`, `auto-movi` y `resumen`: si no hay un usuario en sesión, redirige automáticamente a `/login`. Las rutas `login`, `registro` y `not-found` quedan siempre accesibles.
- Cerrar sesión limpia el usuario de `UsuarioService` (y por lo tanto de `localStorage`) y redirige a Login.

> **Nota:** SQLite (vía `@awesome-cordova-plugins/sqlite` + `cordova-sqlite-storage`) solo funciona en el dispositivo/emulador nativo (Android/iOS). Al correr con `ionic serve` en el navegador, `BdService` detecta la ausencia del entorno Cordova y omite la inicialización de la base de datos.

### Consumo de APIs (base genérica)

El proyecto incluye una base lista para consumir servicios HTTP externos en el futuro:

- `HttpClient` está habilitado globalmente en `AppModule` mediante `provideHttpClient()` (reemplazo moderno de `HttpClientModule`).
- `ApiService` (`src/app/services/api.service.ts`) expone métodos genéricos `get`, `post`, `put` y `delete`, tipados con generics y construidos sobre `environment.apiUrl`.
- `environment.apiUrl` (en `src/environments/environment.ts` y `environment.prod.ts`) centraliza la URL base de la API; hoy es un valor de ejemplo (`https://api.example.com`) que debe reemplazarse cuando exista un backend real.

Para consumir un endpoint desde cualquier página o servicio, basta con inyectar `ApiService` y llamar, por ejemplo, `this.apiService.get<MiTipo>('recurso')`.

## Estructura del Proyecto

- `src/app/` - Contiene los componentes principales de la aplicación
  - `login/` - Inicio de sesión (valida credenciales contra SQLite)
  - `registro/` - Registro de nuevo usuario (persiste en SQLite)
  - `home/` - Página principal y menú de navegación
  - `perfil/` - Datos adicionales del usuario
  - `movimiento/` - Registro manual de movimientos
  - `movimientos/` - Listado y filtro de movimientos manuales
  - `auto-movi/` - Registro de movimientos automáticos
  - `resumen/` - Resumen de ingresos, cobros y balance
  - `not-found/` - Página 404
  - `guards/` - `authGuard`, guarda de rutas basada en la sesión activa
  - `services/` - Servicios compartidos (`UsuarioService` para la sesión, `BdService` para SQLite, `ApiService` para consumo de APIs HTTP, movimientos, movimientos automáticos)
- `src/assets/` - Recursos estáticos (íconos e imágenes)
- `src/environments/` - Configuraciones de entorno
- `src/theme/` - Estilos globales y variables (paleta blanco/gris/negro)
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
