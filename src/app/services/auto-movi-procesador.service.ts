import { Injectable } from '@angular/core';
import { BdService } from './bd.service';

@Injectable({
  providedIn: 'root'
})
export class AutoMoviProcesadorService {

  constructor(private bdService: BdService) {}

  // Genera un Movimiento por cada fecha de factura vencida (pudiendo generar
  // varios si la app no se abrió en más de un periodo) y deja fecha_factura
  // apuntando a la próxima ocurrencia futura según la frecuencia.
  async procesar(usuario: string): Promise<void> {
    if (!usuario) {
      return;
    }

    const autoMovimientos = await this.bdService.listarAutoMovimientos(usuario);
    const hoy = new Date();

    for (const autoMovimiento of autoMovimientos) {
      const fechaFacturaOriginal = autoMovimiento.fechaFactura;
      let fechaFactura = new Date(fechaFacturaOriginal);

      while (fechaFactura <= hoy) {
        await this.bdService.agregarMovimiento({
          usuario,
          descripcion: autoMovimiento.nombre,
          monto: autoMovimiento.monto,
          tipo: autoMovimiento.tipo,
          fechaMovimiento: fechaFactura.toISOString()
        });

        fechaFactura = this.siguienteFecha(fechaFactura, autoMovimiento.frecuencia);
      }

      if (fechaFactura.toISOString() !== fechaFacturaOriginal) {
        await this.bdService.actualizarFechaFacturaAutoMovimiento(autoMovimiento.id!, fechaFactura.toISOString());
      }
    }
  }

  private siguienteFecha(fecha: Date, frecuencia: 'mensual' | 'anual'): Date {
    const siguiente = new Date(fecha);
    if (frecuencia === 'mensual') {
      siguiente.setMonth(siguiente.getMonth() + 1);
    } else {
      siguiente.setFullYear(siguiente.getFullYear() + 1);
    }
    return siguiente;
  }

}
