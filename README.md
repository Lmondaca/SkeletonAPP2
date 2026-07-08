# SkeletonAPP - Ionic Angular Application

Esta es una aplicación móvil desarrollada con Ionic y Angular.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 14.x o superior)
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

Para ejecutar las pruebas end-to-end:
```bash
ng e2e
```

## Estructura del Proyecto

- `src/app/` - Contiene los componentes principales de la aplicación
  - `home/` - Módulo y componentes de la página principal
  - `login/` - Módulo y componentes de la página de inicio de sesión
- `src/assets/` - Recursos estáticos
- `src/environments/` - Configuraciones de entorno
- `src/theme/` - Estilos globales y variables

## Configuración Adicional

La configuración principal de la aplicación se encuentra en:
- `angular.json` - Configuración de Angular
- `capacitor.config.ts` - Configuración de Capacitor
- `ionic.config.json` - Configuración de Ionic