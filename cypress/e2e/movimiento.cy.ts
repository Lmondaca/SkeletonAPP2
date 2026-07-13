export {};

const USUARIO_STORAGE_KEY = 'skeletonapp_usuario';

function loginComo(usuario: string) {
  cy.visit('/movimiento', {
    onBeforeLoad(win) {
      win.localStorage.setItem(USUARIO_STORAGE_KEY, usuario);
    }
  });
}

describe('Movimiento', () => {
  afterEach(() => {
    cy.window().then(win => win.localStorage.removeItem(USUARIO_STORAGE_KEY));
  });

  it('redirige a /login si no hay una sesión iniciada', () => {
    cy.visit('/movimiento');

    cy.location('pathname').should('eq', '/login');
  });

  it('muestra un error si el monto no es mayor a 0', () => {
    loginComo('juanp');

    cy.get('ion-input[name="monto"] input').type('0').blur();

    cy.contains('ion-note', 'El monto debe ser mayor a 0.').should('be.visible');
  });

  it('no muestra error de monto cuando es positivo', () => {
    loginComo('juanp');

    cy.get('ion-input[name="monto"] input').type('15000').blur();

    cy.contains('ion-note', 'El monto debe ser mayor a 0.').should('not.exist');
  });

  it('al guardar un movimiento válido, muestra una alerta (sin base de datos nativa disponible en el navegador)', () => {
    loginComo('juanp');

    cy.get('ion-input[name="descripcion"] input').type('Compra supermercado');
    cy.get('ion-input[name="monto"] input').type('15000');
    cy.contains('ion-segment-button', 'Crédito').click();
    cy.get('input[name="fechaMovimiento"]').type('2026-01-15').blur();

    cy.contains('ion-button', 'Guardar').click();

    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert').contains('No se pudo guardar el movimiento.');
    cy.get('ion-alert').contains('button', 'OK').click();
    cy.get('ion-alert').should('not.exist');
  });

  it('el botón "Ver Movimientos" navega a /movimientos', () => {
    loginComo('juanp');

    cy.contains('ion-button', 'Ver Movimientos').click();

    cy.location('pathname').should('eq', '/movimientos');
  });
});
