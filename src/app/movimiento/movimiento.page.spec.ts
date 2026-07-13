import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { MovimientoPage } from './movimiento.page';
import { MovimientoPageModule } from './movimiento.module';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('MovimientoPage', () => {
  let component: MovimientoPage;
  let fixture: ComponentFixture<MovimientoPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpy: jasmine.Spy;

  const usuarioMock = { usuario: 'juanp' };

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['agregarMovimiento']);
    presentSpy = jasmine.createSpy('present').and.resolveTo();
    alertCreateSpy = jasmine.createSpy('create').and.resolveTo({ present: presentSpy });

    TestBed.configureTestingModule({
      imports: [MovimientoPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(MovimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('guardar - validación de monto', () => {

    it('no guarda si el monto es null', async () => {
      component.monto = null;

      await component.guardar();

      expect(bdServiceSpy.agregarMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si el monto es cero', async () => {
      component.monto = 0;

      await component.guardar();

      expect(bdServiceSpy.agregarMovimiento).not.toHaveBeenCalled();
    });

    it('no guarda si el monto es negativo', async () => {
      component.monto = -100;

      await component.guardar();

      expect(bdServiceSpy.agregarMovimiento).not.toHaveBeenCalled();
    });

    it('guarda si el monto es un número positivo', async () => {
      component.descripcion = 'Compra supermercado';
      component.monto = 15000;
      component.tipo = 'debito';
      component.fechaMovimiento = new Date('2026-01-15');
      bdServiceSpy.agregarMovimiento.and.resolveTo();

      await component.guardar();

      expect(bdServiceSpy.agregarMovimiento).toHaveBeenCalledWith({
        usuario: 'juanp',
        descripcion: 'Compra supermercado',
        monto: 15000,
        tipo: 'debito',
        fechaMovimiento: new Date('2026-01-15').toISOString()
      });
    });

    it('acepta montos decimales positivos', async () => {
      component.monto = 0.01;
      bdServiceSpy.agregarMovimiento.and.resolveTo();

      await component.guardar();

      expect(bdServiceSpy.agregarMovimiento).toHaveBeenCalled();
    });

    it('muestra una alerta de éxito y limpia el formulario tras guardar', async () => {
      component.descripcion = 'Sueldo';
      component.monto = 500000;
      bdServiceSpy.agregarMovimiento.and.resolveTo();

      await component.guardar();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Movimiento' }));
      expect(presentSpy).toHaveBeenCalled();
      expect(component.descripcion).toBe('');
      expect(component.monto).toBeNull();
      expect(component.tipo).toBe('debito');
    });

    it('muestra una alerta de error si no se pudo guardar el movimiento', async () => {
      component.monto = 1000;
      bdServiceSpy.agregarMovimiento.and.rejectWith(new Error('fallo de escritura'));

      await component.guardar();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Error' }));
      expect(presentSpy).toHaveBeenCalled();
    });
  });
});
