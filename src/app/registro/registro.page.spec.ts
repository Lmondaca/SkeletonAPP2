import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { RegistroPage } from './registro.page';
import { RegistroPageModule } from './registro.module';
import { BdService } from '../services/bd.service';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpy: jasmine.Spy;

  // Campos que cumplen todas las reglas de RegistroPage (usuario: 3-8
  // alfanuméricos, contraseña: 4 dígitos, confirmación igual a la contraseña).
  function setCamposValidos() {
    component.nombre = 'Juan';
    component.apellido = 'Perez';
    component.usuario = 'juanp';
    component.contrasena = '1234';
    component.confirmarContrasena = '1234';
  }

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['guardarUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    presentSpy = jasmine.createSpy('present').and.resolveTo();
    alertCreateSpy = jasmine.createSpy('create').and.resolveTo({ present: presentSpy });

    TestBed.configureTestingModule({
      imports: [RegistroPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('contrasenasNoCoinciden', () => {
    it('es false cuando aún no se ha escrito la confirmación', () => {
      component.contrasena = '1234';
      component.confirmarContrasena = '';
      expect(component.contrasenasNoCoinciden).toBeFalse();
    });

    it('es true cuando la confirmación no coincide con la contraseña', () => {
      component.contrasena = '1234';
      component.confirmarContrasena = '4321';
      expect(component.contrasenasNoCoinciden).toBeTrue();
    });

    it('es false cuando la confirmación coincide con la contraseña', () => {
      component.contrasena = '1234';
      component.confirmarContrasena = '1234';
      expect(component.contrasenasNoCoinciden).toBeFalse();
    });
  });

  describe('registrar - validación de campos', () => {

    it('no registra si falta el nombre', async () => {
      setCamposValidos();
      component.nombre = '';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('no registra si falta el apellido', async () => {
      setCamposValidos();
      component.apellido = '';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si el usuario tiene menos de 3 caracteres', async () => {
      setCamposValidos();
      component.usuario = 'ab';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si el usuario tiene más de 8 caracteres', async () => {
      setCamposValidos();
      component.usuario = 'abcdefghi';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si el usuario contiene caracteres no alfanuméricos', async () => {
      setCamposValidos();
      component.usuario = 'juan_p';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si la contraseña no tiene exactamente 4 dígitos', async () => {
      setCamposValidos();
      component.contrasena = '123';
      component.confirmarContrasena = '123';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si la contraseña contiene letras', async () => {
      setCamposValidos();
      component.contrasena = '12a4';
      component.confirmarContrasena = '12a4';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('no registra si la confirmación de contraseña no coincide', async () => {
      setCamposValidos();
      component.confirmarContrasena = '4321';

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).not.toHaveBeenCalled();
    });

    it('registra al usuario y navega a /login cuando todos los campos son válidos', async () => {
      setCamposValidos();
      bdServiceSpy.guardarUsuario.and.resolveTo();

      await component.registrar();

      expect(bdServiceSpy.guardarUsuario).toHaveBeenCalledWith({
        nombre: 'Juan',
        apellido: 'Perez',
        usuario: 'juanp',
        contrasena: '1234'
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('muestra una alerta y no navega si el usuario ya existe', async () => {
      setCamposValidos();
      bdServiceSpy.guardarUsuario.and.rejectWith(new Error('usuario duplicado'));

      await component.registrar();

      expect(alertCreateSpy).toHaveBeenCalled();
      expect(presentSpy).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });
});
