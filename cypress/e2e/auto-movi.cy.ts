export {};

const USUARIO_STORAGE_KEY = 'skeletonapp_usuario';

function loginComo(usuario: string) {
  cy.visit('/auto-movi', {
    onBeforeLoad(win) {
      win.localStorage.setItem(USUARIO_STORAGE_KEY, usuario);
    }
  });
}

describe('Movimiento Automático', () => {
  afterEach(() => {
    cy.window().then(win => win.localStorage.removeItem(USUARIO_STORAGE_KEY));
  });

  it('redirige a /login si no hay una sesión iniciada', () => {
    cy.visit('/auto-movi');

    cy.location('pathname').should('eq', '/login');
  });

  it('muestra un error si el monto no es mayor a 0', () => {
    loginComo('juanp');

    cy.get('ion-input[name="monto"] input').type('0').blur();

    cy.contains('ion-note', 'El monto debe ser mayor a 0.').should('be.visible');
  });

  it('no muestra error de monto cuando es positivo', () => {
    loginComo('juanp');

    cy.get('ion-input[name="monto"] input').type('8000').blur();

    cy.contains('ion-note', 'El monto debe ser mayor a 0.').should('not.exist');
  });

  it('al guardar un movimiento automático válido, muestra una alerta (sin base de datos nativa disponible en el navegador)', () => {
    loginComo('juanp');

    cy.get('ion-input[name="nombre"] input').type('Netflix');
    cy.contains('ion-segment-button', 'Anual').click();
    cy.get('ion-input[name="monto"] input').type('8000');
    cy.get('input[name="fechaFactura"]').type('2026-02-01').blur();
    cy.contains('ion-segment-button', 'Crédito').click();

    cy.contains('ion-button', 'Guardar').click();

    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert').contains('No se pudo guardar el movimiento automático.');
    cy.get('ion-alert').contains('button', 'OK').click();
    cy.get('ion-alert').should('not.exist');
  });

  it('el botón "Ver Movimientos Automáticos" navega a /auto-movimientos', () => {
    loginComo('juanp');

    cy.contains('ion-button', 'Ver Movimientos Automáticos').click();

    cy.location('pathname').should('eq', '/auto-movimientos');
  });
});
