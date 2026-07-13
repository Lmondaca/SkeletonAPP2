export {};

const USUARIO_STORAGE_KEY = 'skeletonapp_usuario';

// NOTA: BdService depende de SQLite nativo, inexistente al correr en el
// navegador (ng serve), así que listarAutoMovimientos() siempre falla y la
// lista queda vacía. No es posible probar "lista con datos" ni "eliminar" de
// punta a punta sin una base de datos real; estas pruebas cubren el
// comportamiento que sí es real y determinista en el navegador.
function loginComo(usuario: string) {
  cy.visit('/auto-movimientos', {
    onBeforeLoad(win) {
      win.localStorage.setItem(USUARIO_STORAGE_KEY, usuario);
    }
  });
}

describe('Movimientos Automáticos', () => {
  afterEach(() => {
    cy.window().then(win => win.localStorage.removeItem(USUARIO_STORAGE_KEY));
  });

  it('redirige a /login si no hay una sesión iniciada', () => {
    cy.visit('/auto-movimientos');

    cy.location('pathname').should('eq', '/login');
  });

  it('muestra la lista vacía y los totales en 0 cuando no hay datos disponibles', () => {
    loginComo('juanp');

    cy.contains('Total Créditos: 0').should('be.visible');
    cy.contains('Total Débitos: 0').should('be.visible');
    cy.contains('No hay movimientos automáticos para el periodo seleccionado.').should('be.visible');
  });

  it('permite aplicar un filtro por fechas sin errores, manteniendo el estado vacío', () => {
    loginComo('juanp');

    cy.get('input[name="fechaDesde"]').type('2026-01-01').blur();
    cy.get('input[name="fechaHasta"]').type('2026-01-31').blur();
    cy.contains('ion-button', 'Filtrar').click();

    cy.contains('No hay movimientos automáticos para el periodo seleccionado.').should('be.visible');
    cy.contains('Total Créditos: 0').should('be.visible');
    cy.contains('Total Débitos: 0').should('be.visible');
  });

  it('"Limpiar Filtro" vacía los campos de fecha', () => {
    loginComo('juanp');

    cy.get('input[name="fechaDesde"]').type('2026-01-01').blur();
    cy.get('input[name="fechaHasta"]').type('2026-01-31').blur();
    cy.contains('ion-button', 'Limpiar Filtro').click();

    cy.get('input[name="fechaDesde"]').should('have.value', '');
    cy.get('input[name="fechaHasta"]').should('have.value', '');
  });
});
