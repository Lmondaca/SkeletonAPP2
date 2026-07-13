import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { PerfilPage } from './perfil.page';
import { PerfilPageModule } from './perfil.module';
import { BdService, Perfil } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpy: jasmine.Spy;

  const usuarioMock = { usuario: 'juanp' };

  // Campos que cumplen la validación de guardar(): todos son obligatorios.
  function setCamposValidos() {
    component.nombre = 'Juan';
    component.apellido = 'Perez';
    component.nivelEducacion = 'Universitaria';
    component.fechaNacimiento = new Date('2000-05-10');
  }

  // Fecha de nacimiento relativa a "hoy" para que el test no dependa de la
  // fecha en que se ejecute: cumple `anios` años exactamente hoy + `dias`.
  function fechaConEdad(anios: number, dias = 0): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear() - anios, hoy.getMonth(), hoy.getDate() + dias);
  }

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['obtenerPerfil', 'guardarPerfil']);
    bdServiceSpy.obtenerPerfil.and.resolveTo(null);
    presentSpy = jasmine.createSpy('present').and.resolveTo();
    alertCreateSpy = jasmine.createSpy('create').and.resolveTo({ present: presentSpy });

    TestBed.configureTestingModule({
      imports: [PerfilPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('expone el usuario de la sesión actual', () => {
    expect(component.usuario).toBe('juanp');
  });

  describe('ionViewWillEnter', () => {
    it('carga los datos del perfil existente', async () => {
      const perfil: Perfil = {
        usuario: 'juanp',
        nombre: 'Juan',
        apellido: 'Perez',
        nivelEducacion: 'Universitaria',
        fechaNacimiento: '2000-05-10T00:00:00.000Z'
      };
      bdServiceSpy.obtenerPerfil.and.resolveTo(perfil);

      await component.ionViewWillEnter();

      expect(bdServiceSpy.obtenerPerfil).toHaveBeenCalledWith('juanp');
      expect(component.nombre).toBe('Juan');
      expect(component.apellido).toBe('Perez');
      expect(component.nivelEducacion).toBe('Universitaria');
      expect(component.fechaNacimiento).toEqual(new Date(perfil.fechaNacimiento));
    });

    it('no modifica los campos si todavía no existe un perfil guardado', async () => {
      bdServiceSpy.obtenerPerfil.and.resolveTo(null);

      await component.ionViewWillEnter();

      expect(component.nombre).toBe('');
      expect(component.apellido).toBe('');
      expect(component.nivelEducacion).toBe('');
      expect(component.fechaNacimiento).toBeNull();
    });

    it('no lanza error si obtenerPerfil falla (SQLite no disponible)', async () => {
      bdServiceSpy.obtenerPerfil.and.rejectWith(new Error('SQLite no disponible'));

      await expectAsync(component.ionViewWillEnter()).toBeResolved();

      expect(component.nombre).toBe('');
    });
  });

  describe('esMenorDeEdad', () => {
    it('es false cuando todavía no hay fecha de nacimiento', () => {
      component.fechaNacimiento = null;
      expect(component.esMenorDeEdad).toBeFalse();
    });

    it('es false cuando la persona ya tiene más de 18 años', () => {
      component.fechaNacimiento = fechaConEdad(30);
      expect(component.esMenorDeEdad).toBeFalse();
    });

    it('es false cuando la persona cumple 18 años exactamente hoy', () => {
      component.fechaNacimiento = fechaConEdad(18);
      expect(component.esMenorDeEdad).toBeFalse();
    });

    it('es true cuando a la persona le falta un día para cumplir 18 años', () => {
      component.fechaNacimiento = fechaConEdad(18, 1);
      expect(component.esMenorDeEdad).toBeTrue();
    });

    it('es true cuando la persona tiene 10 años', () => {
      component.fechaNacimiento = fechaConEdad(10);
      expect(component.esMenorDeEdad).toBeTrue();
    });
  });

  describe('guardar - validación de campos', () => {

    it('no guarda si falta el nombre', async () => {
      setCamposValidos();
      component.nombre = '';

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).not.toHaveBeenCalled();
    });

    it('no guarda si falta el apellido', async () => {
      setCamposValidos();
      component.apellido = '';

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).not.toHaveBeenCalled();
    });

    it('no guarda si falta el nivel de educación', async () => {
      setCamposValidos();
      component.nivelEducacion = '';

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).not.toHaveBeenCalled();
    });

    it('no guarda si falta la fecha de nacimiento', async () => {
      setCamposValidos();
      component.fechaNacimiento = null;

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).not.toHaveBeenCalled();
    });

    it('no guarda si la persona es menor de 18 años', async () => {
      setCamposValidos();
      component.fechaNacimiento = fechaConEdad(17);

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).not.toHaveBeenCalled();
    });

    it('guarda el perfil y muestra una alerta de éxito cuando todos los campos son válidos', async () => {
      setCamposValidos();
      bdServiceSpy.guardarPerfil.and.resolveTo();

      await component.guardar();

      expect(bdServiceSpy.guardarPerfil).toHaveBeenCalledWith({
        usuario: 'juanp',
        nombre: 'Juan',
        apellido: 'Perez',
        nivelEducacion: 'Universitaria',
        fechaNacimiento: component.fechaNacimiento!.toISOString()
      });
      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Perfil' }));
      expect(presentSpy).toHaveBeenCalled();
    });

    it('muestra una alerta de error si no se pudo guardar el perfil', async () => {
      setCamposValidos();
      bdServiceSpy.guardarPerfil.and.rejectWith(new Error('fallo de escritura'));

      await component.guardar();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Error' }));
      expect(presentSpy).toHaveBeenCalled();
    });
  });
});
