describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('redirige la raíz hacia /login y muestra el formulario', () => {
    cy.location('pathname').should('eq', '/login');
    cy.contains('h1', '¡Bienvenido a Skeleton App!').should('be.visible');
  });

  it('el botón "Iniciar Sesión" está deshabilitado con el formulario vacío', () => {
    cy.contains('ion-button', 'Iniciar Sesión').should('have.attr', 'disabled');
  });

  it('muestra un error si el usuario no es alfanumérico de 3 a 8 caracteres', () => {
    cy.get('ion-input[name="usuario"] input').type('ab').blur();

    cy.contains('ion-note', 'El usuario debe ser alfanumérico, entre 3 y 8 caracteres.')
      .should('be.visible');
    cy.contains('ion-button', 'Iniciar Sesión').should('have.attr', 'disabled');
  });

  it('muestra un error si la contraseña no son 4 dígitos numéricos', () => {
    cy.get('ion-input[name="contrasena"] input').type('12').blur();

    cy.contains('ion-note', 'La contraseña debe ser numérica de 4 dígitos.')
      .should('be.visible');
    cy.contains('ion-button', 'Iniciar Sesión').should('have.attr', 'disabled');
  });

  it('habilita el botón "Iniciar Sesión" cuando usuario y contraseña son válidos', () => {
    cy.get('ion-input[name="usuario"] input').type('juanp');
    cy.get('ion-input[name="contrasena"] input').type('1234');

    cy.contains('ion-button', 'Iniciar Sesión').should('not.have.attr', 'disabled');
  });

  it('muestra una alerta al intentar ingresar (sin base de datos nativa disponible en el navegador)', () => {
    cy.get('ion-input[name="usuario"] input').type('juanp');
    cy.get('ion-input[name="contrasena"] input').type('1234');
    cy.contains('ion-button', 'Iniciar Sesión').click();

    cy.get('ion-alert').should('be.visible');
    cy.get('ion-alert').contains('No se pudo validar el usuario.');
    cy.get('ion-alert').contains('button', 'OK').click();
    cy.get('ion-alert').should('not.exist');
  });

  it('el botón "Registrar" navega a /registro', () => {
    cy.contains('ion-button', 'Registrar').click();

    cy.location('pathname').should('eq', '/registro');
  });
});
