import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDatepicker } from '@angular/material/datepicker';
import { ResumenPage } from './resumen.page';
import { ResumenPageModule } from './resumen.module';
import { BdService, MovimientoRegistrado, AutoMovimientoRegistrado } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

describe('ResumenPage', () => {
  let component: ResumenPage;
  let fixture: ComponentFixture<ResumenPage>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;

  const usuarioMock = { usuario: 'juanp' };

  // Fecha dentro de un mes relativo a "hoy" (offsetMeses=0 -> mes actual,
  // -1 -> mes anterior, etc.), fija en el día 15 para evitar problemas de
  // desborde de mes al sumar/restar días cerca de fin de mes.
  function fechaEnMes(offsetMeses: number, dia = 15): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth() + offsetMeses, dia);
  }

  function movimientoRegistrado(overrides: Partial<MovimientoRegistrado> = {}): MovimientoRegistrado {
    return {
      id: 1,
      usuario: 'juanp',
      descripcion: 'Movimiento',
      monto: 1000,
      tipo: 'debito',
      fechaMovimiento: fechaEnMes(0).toISOString(),
      fechaCreacion: fechaEnMes(0).toISOString(),
      fechaModificacion: fechaEnMes(0).toISOString(),
      ...overrides
    };
  }

  function autoMovimientoRegistrado(overrides: Partial<AutoMovimientoRegistrado> = {}): AutoMovimientoRegistrado {
    return {
      id: 1,
      usuario: 'juanp',
      nombre: 'Automático',
      monto: 1000,
      frecuencia: 'mensual',
      fechaFactura: fechaEnMes(0).toISOString(),
      tipo: 'debito',
      ...overrides
    };
  }

  beforeEach(() => {
    bdServiceSpy = jasmine.createSpyObj('BdService', ['listarMovimientos', 'listarAutoMovimientos']);
    bdServiceSpy.listarMovimientos.and.resolveTo([]);
    bdServiceSpy.listarAutoMovimientos.and.resolveTo([]);

    TestBed.configureTestingModule({
      imports: [ResumenPageModule],
      providers: [
        { provide: BdService, useValue: bdServiceSpy },
        { provide: UsuarioService, useValue: usuarioMock }
      ]
    });
    fixture = TestBed.createComponent(ResumenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {

    it('carga los movimientos manuales del mes actual ordenados por fecha descendente', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ descripcion: 'A', fechaMovimiento: fechaEnMes(0, 5).toISOString() }),
        movimientoRegistrado({ descripcion: 'B', fechaMovimiento: fechaEnMes(0, 20).toISOString() }),
        movimientoRegistrado({ descripcion: 'C', fechaMovimiento: fechaEnMes(0, 10).toISOString() })
      ]);

      await component.ionViewWillEnter();

      expect(bdServiceSpy.listarMovimientos).toHaveBeenCalledWith('juanp');
      expect(component.manuales.map(m => m.descripcion)).toEqual(['B', 'C', 'A']);
    });

    it('carga y ordena los movimientos automáticos por fecha de factura descendente', async () => {
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ nombre: 'Netflix', fechaFactura: fechaEnMes(1, 5).toISOString() }),
        autoMovimientoRegistrado({ nombre: 'Luz', fechaFactura: fechaEnMes(1, 20).toISOString() })
      ]);

      await component.ionViewWillEnter();

      expect(bdServiceSpy.listarAutoMovimientos).toHaveBeenCalledWith('juanp');
      expect(component.automaticos.map(a => a.descripcion)).toEqual(['Luz', 'Netflix']);
    });

    it('deja los manuales vacíos si no se pueden cargar (SQLite no disponible)', async () => {
      bdServiceSpy.listarMovimientos.and.rejectWith(new Error('SQLite no disponible'));

      await component.ionViewWillEnter();

      expect(component.manuales).toEqual([]);
    });

    it('deja los automáticos vacíos si no se pueden cargar (SQLite no disponible)', async () => {
      bdServiceSpy.listarAutoMovimientos.and.rejectWith(new Error('SQLite no disponible'));

      await component.ionViewWillEnter();

      expect(component.automaticos).toEqual([]);
    });

    it('selecciona el mes actual como filtro inicial', async () => {
      const hoy = new Date();

      await component.ionViewWillEnter();

      expect(component.mesSeleccionado?.getMonth()).toBe(hoy.getMonth());
      expect(component.mesSeleccionado?.getFullYear()).toBe(hoy.getFullYear());
    });
  });

  describe('totales (ingresos, cobros, balance)', () => {

    it('suma solo los movimientos manuales del mes filtrado; los automáticos no aportan', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ monto: 500000, tipo: 'credito', fechaMovimiento: fechaEnMes(0, 5).toISOString() }),
        movimientoRegistrado({ monto: 200000, tipo: 'debito', fechaMovimiento: fechaEnMes(0, 10).toISOString() }),
        movimientoRegistrado({ monto: 999999, tipo: 'credito', fechaMovimiento: fechaEnMes(-1, 10).toISOString() })
      ]);
      bdServiceSpy.listarAutoMovimientos.and.resolveTo([
        autoMovimientoRegistrado({ monto: 800000, tipo: 'credito', fechaFactura: fechaEnMes(0, 12).toISOString() })
      ]);

      await component.ionViewWillEnter();

      expect(component.totalIngresos).toBe(500000);
      expect(component.totalCobros).toBe(200000);
      expect(component.balance).toBe(300000);
    });

    it('el balance es negativo cuando los cobros superan a los ingresos', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ monto: 100000, tipo: 'credito', fechaMovimiento: fechaEnMes(0, 5).toISOString() }),
        movimientoRegistrado({ monto: 300000, tipo: 'debito', fechaMovimiento: fechaEnMes(0, 10).toISOString() })
      ]);

      await component.ionViewWillEnter();

      expect(component.balance).toBe(-200000);
    });
  });

  describe('filtro por mes', () => {

    it('onMesSeleccionado filtra los manuales al mes elegido y cierra el datepicker', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ descripcion: 'Mes actual', fechaMovimiento: fechaEnMes(0, 10).toISOString() }),
        movimientoRegistrado({ descripcion: 'Mes anterior', fechaMovimiento: fechaEnMes(-1, 10).toISOString() })
      ]);
      await component.ionViewWillEnter();

      const pickerSpy = jasmine.createSpyObj('MatDatepicker', ['close']);

      component.onMesSeleccionado(fechaEnMes(-1, 1), pickerSpy as unknown as MatDatepicker<Date>);

      expect(component.manuales.map(m => m.descripcion)).toEqual(['Mes anterior']);
      expect(pickerSpy.close).toHaveBeenCalled();
    });

    it('limpiarFiltroMes muestra todos los movimientos manuales sin filtrar por mes', async () => {
      bdServiceSpy.listarMovimientos.and.resolveTo([
        movimientoRegistrado({ descripcion: 'Mes actual', fechaMovimiento: fechaEnMes(0, 10).toISOString() }),
        movimientoRegistrado({ descripcion: 'Mes anterior', fechaMovimiento: fechaEnMes(-1, 10).toISOString() })
      ]);
      await component.ionViewWillEnter();
      expect(component.manuales.length).toBe(1);

      component.limpiarFiltroMes();

      expect(component.mesSeleccionado).toBeNull();
      expect(component.manuales.length).toBe(2);
    });
  });
});
