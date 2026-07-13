export {};

const USUARIO_STORAGE_KEY = 'skeletonapp_usuario';

// NOTA: BdService depende de SQLite nativo, inexistente al correr en el
// navegador (ng serve), así que listarMovimientos()/listarAutoMovimientos()
// siempre fallan y ambas listas quedan vacías. Estas pruebas cubren el
// comportamiento que sí es real y determinista en el navegador.
function loginComo(usuario: string) {
  cy.visit('/resumen', {
    onBeforeLoad(win) {
      win.localStorage.setItem(USUARIO_STORAGE_KEY, usuario);
    }
  });
}

describe('Resumen', () => {
  afterEach(() => {
    cy.window().then(win => win.localStorage.removeItem(USUARIO_STORAGE_KEY));
  });

  it('redirige a /login si no hay una sesión iniciada', () => {
    cy.visit('/resumen');

    cy.location('pathname').should('eq', '/login');
  });

  it('muestra los totales en 0 y ambas listas vacías cuando no hay datos disponibles', () => {
    loginComo('juanp');

    cy.contains('.total-ingresos', 'Ingresos').contains('0');
    cy.contains('.total-cobros', 'Cobros').contains('0');
    cy.contains('Balance (Positivo)').should('be.visible');
    cy.contains('No hay movimientos manuales registrados.').should('be.visible');
    cy.contains('No hay movimientos automáticos registrados.').should('be.visible');
  });

  it('selecciona el mes actual como filtro inicial', () => {
    loginComo('juanp');

    cy.get('input[name="mesSeleccionado"]').invoke('val').should('not.be.empty');
  });

  it('"Limpiar Filtro" vacía el mes seleccionado', () => {
    loginComo('juanp');

    cy.get('input[name="mesSeleccionado"]').invoke('val').should('not.be.empty');
    cy.contains('ion-button', 'Limpiar Filtro').click();

    cy.get('input[name="mesSeleccionado"]').should('have.value', '');
  });
});
