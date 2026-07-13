import { Injectable } from '@angular/core';

export interface AutoMovimiento {
  nombre: string;
  monto: number;
  frecuencia: 'mensual' | 'anual';
  fechaFactura: Date;
  tipo: 'debito' | 'credito';
}

@Injectable({
  providedIn: 'root'
})
export class AutoMoviService {

  private autoMovimientos: AutoMovimiento[] = [];

  agregar(autoMovimiento: AutoMovimiento) {
    this.autoMovimientos.push(autoMovimiento);
  }

  listar(): AutoMovimiento[] {
    return this.autoMovimientos;
  }

  // TODO: revisar 1 vez por día si la fechaFactura de algún AutoMovimiento
  // corresponde al día actual (considerando la frecuencia mensual/anual) y,
  // de ser así, crear automáticamente el Movimiento correspondiente vía
  // MovimientoService.agregar().

}
