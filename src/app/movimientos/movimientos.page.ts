import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Movimiento, MovimientoService } from '../services/movimiento.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
  standalone: false,
})
export class MovimientosPage implements ViewWillEnter {

  movimientos: Movimiento[] = [];
  movimientosFiltrados: Movimiento[] = [];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  totalCredito = 0;
  totalDebito = 0;

  constructor(private movimientoService: MovimientoService) {}

  ionViewWillEnter() {
    this.movimientos = this.movimientoService.listar();
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.aplicarFiltro();
  }

  filtrar() {
    this.aplicarFiltro();
  }

  limpiarFiltro() {
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.aplicarFiltro();
  }

  private aplicarFiltro() {
    const desde = this.fechaDesde ? new Date(this.fechaDesde.getFullYear(), this.fechaDesde.getMonth(), this.fechaDesde.getDate(), 0, 0, 0) : null;
    const hasta = this.fechaHasta ? new Date(this.fechaHasta.getFullYear(), this.fechaHasta.getMonth(), this.fechaHasta.getDate(), 23, 59, 59, 999) : null;

    this.movimientosFiltrados = this.movimientos.filter(m => {
      if (desde && m.fechaMovimiento < desde) {
        return false;
      }
      if (hasta && m.fechaMovimiento > hasta) {
        return false;
      }
      return true;
    });

    this.totalCredito = this.movimientosFiltrados
      .filter(m => m.tipo === 'credito')
      .reduce((total, m) => total + m.monto, 0);

    this.totalDebito = this.movimientosFiltrados
      .filter(m => m.tipo === 'debito')
      .reduce((total, m) => total + m.monto, 0);
  }

}
