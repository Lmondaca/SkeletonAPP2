import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertController } from '@ionic/angular';
import { AutoMovimientosPage } from './auto-movimientos.page';
import { AutoMovimientosPageModule } from './auto-movimientos.module';
import { BdService, AutoMovimientoRegistrado } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('AutoMovimientosPage', () => {
  let component: AutoMovimientosPage;
  let fixture: ComponentFixture<AutoMovimientosPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let alertCreateSpy: jasmine.Spy;
  let presentSpies: jasmine.Spy[];

  const usuarioMock = { usuario: 'juanp' };

  function autoMovimientoRegistrado(overrides: Partial<AutoMovimientoRegistrado> = {}): AutoMovimientoRegistrado {
    return {
      id: 1,
      usuario: 'juanp',
      nombre: 'Netflix',
      monto: 8000,
      frecuencia: 'mensual',
      fechaFactura: '2026-01-10T00:00:00.000Z',
      tipo: 'debito',
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
    bdServiceSpy = jasmine.createSpyObj('BdService', ['listarAutoMovimientos', 'eliminarAutoMovimiento']);
    bdServiceSpy.listarAutoMovimientos.and.resolveTo([]);
    alertCreateSpy = configurarAlertCreateSpy();

    TestBed.configureTestingModule({
      imports: [AutoMovimientosPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock },
        { provide: AlertController, useValue: { create: alertCreateSpy } }
      ]
    });
    fixture = TestBed.createComponent(AutoMovimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('lista de movimientos automáticos', () => {

    it('carga y mapea los movimientos automáticos del usuario actual', async () => {
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ id: 1, nombre: 'Netflix', frecuencia: 'mensual' }),
        autoMovimientoRegistrado({ id: 2, nombre: 'Seguro Auto', frecuencia: 'anual' })
      ]);

      await component.ionViewWillEnter();

      expect(bdServiceSpy.listarAutoMovimientos).toHaveBeenCalledWith('juanp');
      expect(component.autoMovimientos.length).toBe(2);
      expect(component.autoMovimientosFiltrados.length).toBe(2);
      expect(component.autoMovimientos[1].nombre).toBe('Seguro Auto');
      expect(component.autoMovimientos[1].frecuencia).toBe('anual');
      expect(component.autoMovimientos[0].fechaFactura).toEqual(new Date('2026-01-10T00:00:00.000Z'));
    });

    it('calcula el total de créditos y débitos de la lista cargada', async () => {
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ id: 1, monto: 500000, tipo: 'credito' }),
        autoMovimientoRegistrado({ id: 2, monto: 8000, tipo: 'debito' }),
        autoMovimientoRegistrado({ id: 3, monto: 12000, tipo: 'debito' })
      ]);

      await component.ionViewWillEnter();

      expect(component.totalCredito).toBe(500000);
      expect(component.totalDebito).toBe(20000);
    });

    it('deja la lista vacía si no se pueden cargar los movimientos automáticos (SQLite no disponible)', async () => {
      bdServiceSpy.listarAutoMovimientos.and.rejectWith(new Error('SQLite no disponible'));

      await component.ionViewWillEnter();

      expect(component.autoMovimientos).toEqual([]);
      expect(component.autoMovimientosFiltrados).toEqual([]);
    });

    it('filtrar() excluye los movimientos automáticos fuera del rango de fechas', async () => {
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ id: 1, fechaFactura: '2026-01-05T12:00:00.000Z' }),
        autoMovimientoRegistrado({ id: 2, fechaFactura: '2026-01-15T12:00:00.000Z' }),
        autoMovimientoRegistrado({ id: 3, fechaFactura: '2026-01-25T12:00:00.000Z' })
      ]);
      await component.ionViewWillEnter();

      component.fechaDesde = new Date('2026-01-10');
      component.fechaHasta = new Date('2026-01-20');
      component.filtrar();

      expect(component.autoMovimientosFiltrados.map(a => a.id)).toEqual([2]);
    });

    it('limpiarFiltro() vuelve a mostrar todos los movimientos automáticos', async () => {
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ id: 1, fechaFactura: '2026-01-05T12:00:00.000Z' }),
        autoMovimientoRegistrado({ id: 2, fechaFactura: '2026-01-25T12:00:00.000Z' })
      ]);
      await component.ionViewWillEnter();
      component.fechaDesde = new Date('2026-01-10');
      component.filtrar();
      expect(component.autoMovimientosFiltrados.length).toBe(1);

      component.limpiarFiltro();

      expect(component.fechaDesde).toBeNull();
      expect(component.fechaHasta).toBeNull();
      expect(component.autoMovimientosFiltrados.length).toBe(2);
    });
  });

  describe('eliminar - botón eliminar', () => {
    const autoMovimiento = {
      id: 7,
      nombre: 'Netflix',
      monto: 8000,
      frecuencia: 'mensual' as const,
      fechaFactura: new Date(),
      tipo: 'debito' as const
    };

    function obtenerBoton(textoBoton: string) {
      const opciones = alertCreateSpy.calls.argsFor(0)[0];
      return opciones.buttons.find((b: any) => b.text === textoBoton);
    }

    it('abre una alerta de confirmación con el nombre del movimiento automático', async () => {
      await component.eliminar(autoMovimiento);

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({
        header: 'Eliminar movimiento automático',
        message: jasmine.stringMatching('Netflix')
      }));
      expect(presentSpies[0]).toHaveBeenCalled();
      expect(bdServiceSpy.eliminarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('el botón Cancelar no ejecuta ninguna acción de borrado', async () => {
      await component.eliminar(autoMovimiento);

      const cancelar = obtenerBoton('Cancelar');

      expect(cancelar.role).toBe('cancel');
      expect(cancelar.handler).toBeUndefined();
      expect(bdServiceSpy.eliminarAutoMovimiento).not.toHaveBeenCalled();
    });

    it('al confirmar "Eliminar", borra el movimiento automático y recarga la lista', async () => {
      bdServiceSpy.eliminarAutoMovimiento.and.resolveTo();
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([]);

      await component.eliminar(autoMovimiento);
      const eliminarBoton = obtenerBoton('Eliminar');
      expect(eliminarBoton.role).toBe('destructive');

      await eliminarBoton.handler();

      expect(bdServiceSpy.eliminarAutoMovimiento).toHaveBeenCalledWith(7);
      expect(bdServiceSpy.listarAutoMovimientos).toHaveBeenCalledWith('juanp');
    });

    it('si falla la eliminación, muestra una alerta de error', async () => {
      bdServiceSpy.eliminarAutoMovimiento.and.rejectWith(new Error('fallo de escritura'));

      await component.eliminar(autoMovimiento);
      const eliminarBoton = obtenerBoton('Eliminar');
      await eliminarBoton.handler();

      expect(alertCreateSpy).toHaveBeenCalledWith(jasmine.objectContaining({ header: 'Error' }));
      expect(presentSpies[1]).toHaveBeenCalled();
    });
  });
});
