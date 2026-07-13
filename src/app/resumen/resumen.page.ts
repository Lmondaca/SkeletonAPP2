import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { MatDatepicker } from '@angular/material/datepicker';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';
import { AutoMoviService } from '../services/auto-movi.service';

interface ResumenItem {
  descripcion: string;
  monto: number;
  tipo: 'debito' | 'credito';
  fecha: Date;
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
  standalone: false,
})
export class ResumenPage implements ViewWillEnter {

  private manualesOriginal: ResumenItem[] = [];

  manuales: ResumenItem[] = [];
  automaticos: ResumenItem[] = [];

  mesSeleccionado: Date | null = null;

  totalIngresos = 0;
  totalCobros = 0;
  balance = 0;

  constructor(
    private bdService: BdService,
    private usuarioService: UsuarioService,
    private autoMoviService: AutoMoviService
  ) {}

  async ionViewWillEnter() {
    try {
      const registros = await this.bdService.listarMovimientos(this.usuarioService.usuario);
      this.manualesOriginal = registros
        .map(m => ({
          descripcion: m.descripcion,
          monto: m.monto,
          tipo: m.tipo,
          fecha: new Date(m.fechaMovimiento)
        }))
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    } catch (error) {
      this.manualesOriginal = [];
    }

    this.automaticos = this.autoMoviService.listar()
      .map(a => ({
        descripcion: a.nombre,
        monto: a.monto,
        tipo: a.tipo,
        fecha: a.fechaFactura
      }))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    this.mesSeleccionado = new Date();
    this.aplicarFiltroMes();
  }

  onMesSeleccionado(fecha: Date, picker: MatDatepicker<Date>) {
    this.mesSeleccionado = fecha;
    picker.close();
    this.aplicarFiltroMes();
  }

  limpiarFiltroMes() {
    this.mesSeleccionado = null;
    this.aplicarFiltroMes();
  }

  private aplicarFiltroMes() {
    if (this.mesSeleccionado) {
      const mes = this.mesSeleccionado.getMonth();
      const anio = this.mesSeleccionado.getFullYear();
      this.manuales = this.manualesOriginal.filter(m =>
        m.fecha.getMonth() === mes && m.fecha.getFullYear() === anio
      );
    } else {
      this.manuales = this.manualesOriginal;
    }

    // Solo los movimientos manuales (del mes filtrado) aportan a los totales;
    // los automáticos son a futuro y aún no se han efectuado.
    this.totalIngresos = this.manuales
      .filter(i => i.tipo === 'credito')
      .reduce((total, i) => total + i.monto, 0);

    this.totalCobros = this.manuales
      .filter(i => i.tipo === 'debito')
      .reduce((total, i) => total + i.monto, 0);

    this.balance = this.totalIngresos - this.totalCobros;
  }

}
