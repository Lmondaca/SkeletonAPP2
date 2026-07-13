import { Component } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

interface MovimientoVista {
  id: number;
  descripcion: string;
  monto: number;
  tipo: 'debito' | 'credito';
  fechaMovimiento: Date;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
  standalone: false,
})
export class MovimientosPage implements ViewWillEnter {

  movimientos: MovimientoVista[] = [];
  movimientosFiltrados: MovimientoVista[] = [];

  fechaDesde: Date | null = null;
  fechaHasta: Date | null = null;

  totalCredito = 0;
  totalDebito = 0;

  constructor(
    private bdService: BdService,
    private usuarioService: UsuarioService,
    private alertController: AlertController
  ) {}

  async ionViewWillEnter() {
    await this.cargarMovimientos();
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.aplicarFiltro();
  }

  private async cargarMovimientos() {
    try {
      const registros = await this.bdService.listarMovimientos(this.usuarioService.usuario);
      this.movimientos = registros.map(m => ({
        id: m.id!,
        descripcion: m.descripcion,
        monto: m.monto,
        tipo: m.tipo,
        fechaMovimiento: new Date(m.fechaMovimiento),
        fechaCreacion: new Date(m.fechaCreacion),
        fechaModificacion: new Date(m.fechaModificacion)
      }));
    } catch (error) {
      this.movimientos = [];
    }
  }

  async eliminar(movimiento: MovimientoVista) {
    const alert = await this.alertController.create({
      header: 'Eliminar movimiento',
      message: `¿Seguro que deseas eliminar "${movimiento.descripcion}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.bdService.eliminarMovimiento(movimiento.id);
              await this.cargarMovimientos();
              this.aplicarFiltro();
            } catch (error) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar el movimiento.',
                buttons: ['OK']
              });
              await errorAlert.present();
            }
          }
        }
      ]
    });
    await alert.present();
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
