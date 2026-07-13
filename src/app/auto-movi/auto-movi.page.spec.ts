import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AutoMoviPage } from './auto-movi.page';
import { AutoMoviPageModule } from './auto-movi.module';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('AutoMoviPage', () => {
  let component: AutoMoviPage;
  let fixture: ComponentFixture<AutoMoviPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpy: jasmine.Spy;

  const usuarioMock = { usuario: 'juanp' };

  // Campos que cumplen la validación de guardar(): nombre, monto positivo y
  // fecha de factura son obligatorios.
  function setCamposValidos() {
    component.nombre = 'Netflix';
    component.monto = 8000;
    component.frecuencia = 'mensual';
    component.fechaFactura = new Date('2026-02-01');
    component.tipo = 'debito';
  }

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['agregarAutoMovimiento']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    presentSpy = jasmine.createSpy('present').and.resolveTo();
    alertCreateSpy = jasmine.createSpy('create').and.resolveTo({ present: presentSpy });

    TestBed.configureTestingModule({
      imports: [AutoMoviPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(AutoMoviPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('guardar - validación de campos', () => {

    it('no guarda si falta el nombre', async () => {
      setCamposValidos();
      component.nombre = '';

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si el monto es null', async () => {
      setCamposValidos();
      component.monto = null;

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si el monto es cero', async () => {
      setCamposValidos();
      component.monto = 0;

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si el monto es negativo', async () => {
      setCamposValidos();
      component.monto = -500;

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si falta la fecha de factura', async () => {
      setCamposValidos();
      component.fechaFactura = null;

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('guarda el movimiento automático cuando todos los campos son válidos', async () => {
      setCamposValidos();
      bdServiceSpy.agregarAutoMovimiento.and.resolveTo();

      await component.guardar();

      expect(bdServiceSpy.agregarAutoMovimiento).toHaveBeenCalledWith({
        usuario: 'juanp',
        nombre: 'Netflix',
        monto: 8000,
        frecuencia: 'mensual',
        fechaFactura: new Date('2026-02-01').toISOString(),
        tipo: 'debito'
      });
    });

    it('muestra una alerta de éxito y limpia el formulario tras guardar', async () => {
      setCamposValidos();
      bdServiceSpy.agregarAutoMovimiento.and.resolveTo();

      await component.guardar();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Movimiento Automático' }));
      expect(presentSpy).toHaveBeenCalled();
      expect(component.nombre).toBe('');
      expect(component.monto).toBeNull();
      expect(component.frecuencia).toBe('mensual');
      expect(component.fechaFactura).toBeNull();
      expect(component.tipo).toBe('debito');
    });

    it('muestra una alerta de error si no se pudo guardar el movimiento automático', async () => {
      setCamposValidos();
      bdServiceSpy.agregarAutoMovimiento.and.rejectWith(new Error('fallo de escritura'));

      await component.guardar();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Error' }));
      expect(presentSpy).toHaveBeenCalled();
    });
  });

  describe('irAutoMovimientos', () => {
    it('navega al listado de movimientos automáticos', () => {
      component.irAutoMovimientos();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auto-movimientos']);
    });
  });
});
