const USUARIO_STORAGE_KEY = 'skeletonapp_usuario';

// Fecha ISO relativa a "hoy" para que el test no dependa de cuándo se corra:
// nace hace `anios` años (día fijo 01-01 para evitar bordes de mes/año).
function fechaHaceAnios(anios: number): string {
  const anio = new Date().getFullYear() - anios;
  return `${anio}-01-01`;
}

function loginComo(usuario: string) {
  cy.visit('/perfil', {
    onBeforeLoad(win) {
      win.localStorage.setItem(USUARIO_STORAGE_KEY, usuario);
    }
  });
}

function seleccionarNivelEducacion(texto: string) {
  cy.get('ion-select[name="nivelEducacion"]').click();
  cy.get('ion-popover.select-popover ion-item').contains(texto).click();
  // Espera a que el popover termine su animación de cierre antes de seguir,
  // para no interactuar con el resto del formulario en plena transición.
  cy.get('ion-popover.select-popover').should('not.exist');
}

describe('Perfil', () => {
  afterEach(() => {
    cy.window().then(win => win.localStorage.removeItem(USUARIO_STORAGE_KEY));
  });

  it('redirige a /login si no hay una sesión iniciada', () => {
    cy.visit('/perfil');

    cy.location('pathname').should('eq', '/login');
  });

  it('muestra los datos del usuario de la sesión actual', () => {
    loginComo('juanp');

    cy.contains('strong', 'Datos de juanp').should('be.visible');
  });

  it('muestra un error si la fecha de nacimiento indica menos de 18 años', () => {
    loginComo('juanp');

    cy.get('ion-input[name="nombre"] input').type('Juan');
    cy.get('ion-input[name="apellido"] input').type('Perez');
    seleccionarNivelEducacion('Universitaria');
    cy.get('input[name="fechaNacimiento"]').type(fechaHaceAnios(5)).blur();

    cy.contains('ion-note', 'Debes ser mayor de 18 años.').should('be.visible');

    cy.contains('ion-button', 'Guardar').click();
    cy.get('ion-alert').should('not.exist');
  });

  it('al guardar un perfil válido, muestra una alerta (sin base de datos nativa disponible en el navegador)', () => {
    loginComo('juanp');

    cy.get('ion-input[name="nombre"] input').type('Juan');
    cy.get('ion-input[name="apellido"] input').type('Perez');
    seleccionarNivelEducacion('Universitaria');
    cy.get('input[name="fechaNacimiento"]').type(fechaHaceAnios(30)).blur();

    cy.contains('ion-note', 'Debes ser mayor de 18 años.').should('not.exist');

    cy.contains('ion-button', 'Guardar').click();

    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert').contains('No se pudo guardar el perfil.');
    cy.get('ion-alert').contains('button', 'OK').click();
    cy.get('ion-alert').should('not.exist');
  });
});
