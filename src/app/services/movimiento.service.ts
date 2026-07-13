import { Injectable } from '@angular/core';

export interface Movimiento {
  descripcion: string;
  monto: number;
  tipo: 'debito' | 'credito';
  fechaMovimiento: Date;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private movimientos: Movimiento[] = [];

  agregar(movimiento: Pick<Movimiento, 'descripcion' | 'monto' | 'tipo' | 'fechaMovimiento'>) {
    const ahora = new Date();
    this.movimientos.push({
      ...movimiento,
      fechaCreacion: ahora,
      fechaModificacion: ahora
    });
  }

  listar(): Movimiento[] {
    return this.movimientos;
  }

}
