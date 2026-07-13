import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { MovimientosPage } from './movimientos.page';
import { MovimientosPageModule } from './movimientos.module';
import { BdService, MovimientoRegistrado } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('MovimientosPage', () => {
  let component: MovimientosPage;
  let fixture: ComponentFixture<MovimientosPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpies: jasmine.Spy[];

  const usuarioMock = { usuario: 'juanp' };

  function movimientoRegistrado(overrides: Partial<MovimientoRegistrado> = {}): MovimientoRegistrado {
    return {
      id: 1,
      usuario: 'juanp',
      descripcion: 'Movimiento',
      monto: 1000,
      tipo: 'debito',
      fechaMovimiento: '2026-01-10T00:00:00.000Z',
      fechaCreacion: '2026-01-10T00:00:00.000Z',
      fechaModificacion: '2026-01-10T00:00:00.000Z',
      ...overrides
    };
  }

  // Cada llamada a alertController.create() devuelve un alert con su propio
  // spy de present(), para poder distinguir la alerta de confirmación de una
  // eventual alerta de error posterior.
  function configurarAlertCreateSpy() {
    presentSpies = [];
    return jasmine.createSpy('create').and.callFake(() => {
      const presentSpy = jasmine.createSpy('present').and.resolveTo();
      presentSpies.push(presentSpy);
      return Promise.resolve({ present: presentSpy });
    });
  }

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['listarMovimientos', 'eliminarMovimiento']);
    bdServiceSpy.listarMovimientos.and.resolveTo([]);
    alertCreateSpy = configurarAlertCreateSpy();

    TestBed.configureTestingModule({
      imports: [MovimientosPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(MovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('lista de movimientos ingresados', () => {

    it('carga y mapea los movimientos del usuario actual', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ id: 1, descripcion: 'Sueldo', monto: 500000, tipo: 'credito' }),
        movimientoRegistrado({ id: 2, descripcion: 'Arriendo', monto: 300000, tipo: 'debito' })
      ]);

      await component.ionViewWillEnter();

      expect(bdServiceSpy.listarMovimientos).toHaveBeenCalledWith('juanp');
      expect(component.movimientos.length).toBe(2);
      expect(component.movimientosFiltrados.length).toBe(2);
      expect(component.movimientos[0].descripcion).toBe('Sueldo');
      expect(component.movimientos[0].fechaMovimiento).toEqual(new Date('2026-01-10T00:00:00.000Z'));
    });

    it('calcula el total de créditos y débitos de la lista cargada', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ id: 1, monto: 500000, tipo: 'credito' }),
        movimientoRegistrado({ id: 2, monto: 100000, tipo: 'credito' }),
        movimientoRegistrado({ id: 3, monto: 300000, tipo: 'debito' })
      ]);

      await component.ionViewWillEnter();

      expect(component.totalCredito).toBe(600000);
      expect(component.totalDebito).toBe(300000);
    });

    it('deja la lista vacía si no se pueden cargar los movimientos (SQLite no disponible)', async () => {
      bdServiceSpy.listarMovimientos.and.rejectWith(new Error('SQLite no disponible'));

      await component.ionViewWillEnter();

      expect(component.movimientos).toEqual([]);
      expect(component.movimientosFiltrados).toEqual([]);
    });

    it('filtrar() excluye los movimientos fuera del rango de fechas', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ id: 1, fechaMovimiento: '2026-01-05T12:00:00.000Z' }),
        movimientoRegistrado({ id: 2, fechaMovimiento: '2026-01-15T12:00:00.000Z' }),
        movimientoRegistrado({ id: 3, fechaMovimiento: '2026-01-25T12:00:00.000Z' })
      ]);
      await component.ionViewWillEnter();

      component.fechaDesde = new Date('2026-01-10');
      component.fechaHasta = new Date('2026-01-20');
      component.filtrar();

      expect(component.movimientosFiltrados.map(m => m.id)).toEqual([2]);
    });

    it('limpiarFiltro() vuelve a mostrar todos los movimientos', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ id: 1, fechaMovimiento: '2026-01-05T12:00:00.000Z' }),
        movimientoRegistrado({ id: 2, fechaMovimiento: '2026-01-25T12:00:00.000Z' })
      ]);
      await component.ionViewWillEnter();
      component.fechaDesde = new Date('2026-01-10');
      component.filtrar();
      expect(component.movimientosFiltrados.length).toBe(1);

      component.limpiarFiltro();

      expect(component.fechaDesde).toBeNull();
      expect(component.fechaHasta).toBeNull();
      expect(component.movimientosFiltrados.length).toBe(2);
    });
  });

  describe('eliminar - botón eliminar', () => {
    const movimiento = {
      id: 7,
      descripcion: 'Compra supermercado',
      monto: 1000,
      tipo: 'debito' as const,
      fechaMovimiento: new Date(),
      fechaCreacion: new Date(),
      fechaModificacion: new Date()
    };

    function obtenerBoton(textoBoton: string) {
      const opciones = alertCreateSpy.calls.argsFor(0)[0];
      return opciones.buttons.find((b: any) => b.text === textoBoton);
    }

    it('abre una alerta de confirmación con la descripción del movimiento', async () => {
      await component.eliminar(movimiento);

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Eliminar movimiento',
        message: jasmine.stringMatching('Compra supermercado')
      }));
      expect(presentSpies[0]).toHaveBeenCalled();
      expect(bdServiceSpy.eliminarMovimiento).not.toHaveBeenCalled();
    });

    it('el botón Cancelar no ejecuta ninguna acción de borrado', async () => {
      await component.eliminar(movimiento);

      const cancelar = obtenerBoton('Cancelar');

      expect(cancelar.role).toBe('cancel');
      expect(cancelar.handler).toBeUndefined();
      expect(bdServiceSpy.eliminarMovimiento).not.toHaveBeenCalled();
    });

    it('al confirmar "Eliminar", borra el movimiento y recarga la lista', async () => {
      bdServiceSpy.eliminarMovimiento.and.resolveTo();
      bdServiceSpy.listarMovimientos.and.resolveTo([]);

      await component.eliminar(movimiento);
      const eliminarBoton = obtenerBoton('Eliminar');
      expect(eliminarBoton.role).toBe('destructive');

      await eliminarBoton.handler();

      expect(bdServiceSpy.eliminarMovimiento).toHaveBeenCalledWith(7);
      expect(bdServiceSpy.listarMovimientos).toHaveBeenCalledWith('juanp');
    });

    it('si falla la eliminación, muestra una alerta de error', async () => {
      bdServiceSpy.eliminarMovimiento.and.rejectWith(new Error('fallo de escritura'));

      await component.eliminar(movimiento);
      const eliminarBoton = obtenerBoton('Eliminar');
      await eliminarBoton.handler();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Error' }));
      expect(presentSpies[1]).toHaveBeenCalled();
    });
  });
});
