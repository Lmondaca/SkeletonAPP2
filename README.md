# Skeleton App - Ionic Angular Application

Aplicación móvil de control de ingresos y gastos personales, desarrollada con Ionic, Angular y Angular Material, con una temática visual de esqueleto (paleta blanco/gris/negro).

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18.19 o superior)
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

1. **Login** (`/login`) - ingreso de usuario (alfanumérico, 3 a 8 caracteres) y contraseña (numérica, 4 dígitos). Incluye acceso a Registro.
2. **Registro** (`/registro`) - formulario de registro básico (nombre, apellido, usuario, contraseña y confirmación); al validar los campos redirige a Login.
3. **Home** (`/home`) - página de bienvenida tras iniciar sesión, con acceso directo a las demás páginas.
4. **Perfil** (`/perfil`) - formulario de datos adicionales del usuario (nombre, apellido, nivel de educación, fecha de nacimiento).
5. **Movimiento** (`/movimiento`) - registro manual de un movimiento financiero (descripción, monto, tipo débito/crédito, fecha de movimiento).
6. **Movimientos** (`/movimientos`) - listado de movimientos manuales, con filtro por rango de fechas y totales de créditos/débitos.
7. **Auto-Movi** (`/auto-movi`) - registro de movimientos automáticos recurrentes (sueldos, suscripciones, seguros), con frecuencia mensual/anual y fecha de factura.
8. **Resumen** (`/resumen`) - resumen combinado de movimientos manuales y automáticos, con totales de ingresos, cobros y balance, filtrable por mes.

Todas las páginas posteriores al login incluyen un menú lateral (☰) para navegar entre ellas y cerrar sesión.

## Estructura del Proyecto

- `src/app/` - Contiene los componentes principales de la aplicación
  - `login/` - Inicio de sesión
  - `registro/` - Registro de nuevo usuario
  - `home/` - Página principal y menú de navegación
  - `perfil/` - Datos adicionales del usuario
  - `movimiento/` - Registro manual de movimientos
  - `movimientos/` - Listado y filtro de movimientos manuales
  - `auto-movi/` - Registro de movimientos automáticos
  - `resumen/` - Resumen de ingresos, cobros y balance
  - `services/` - Servicios compartidos (usuario en sesión, movimientos, movimientos automáticos)
- `src/assets/` - Recursos estáticos (íconos e imágenes)
- `src/environments/` - Configuraciones de entorno
- `src/theme/` - Estilos globales y variables (paleta blanco/gris/negro)

## Dependencias Destacadas

- `@ionic/angular` - Componentes de interfaz móvil
- `@angular/material` - Selector de fechas (`MatDatepicker`), usado en Perfil, Movimiento, Movimientos, Auto-Movi y Resumen

## Configuración Adicional

La configuración principal de la aplicación se encuentra en:
- `angular.json` - Configuración de Angular
- `capacitor.config.ts` - Configuración de Capacitor
- `ionic.config.json` - Configuración de Ionic
