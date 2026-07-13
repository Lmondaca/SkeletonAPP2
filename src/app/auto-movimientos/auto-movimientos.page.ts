import { Component } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

interface AutoMovimientoVista {
  id: number;
  nombre: string;
  monto: number;
  frecuencia: 'mensual' | 'anual';
  fechaFactura: Date;
  tipo: 'debito' | 'credito';
}

@Component({
  selector: 'app-auto-movimientos',
  templateUrl: './auto-movimientos.page.html',
  styleUrls: ['./auto-movimientos.page.scss'],
  standalone: false,
})
export class AutoMovimientosPage implements ViewWillEnter {

  autoMovimientos: AutoMovimientoVista[] = [];
  autoMovimientosFiltrados: AutoMovimientoVista[] = [];

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
    await this.cargarAutoMovimientos();
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.aplicarFiltro();
  }

  private async cargarAutoMovimientos() {
    try {
      const registros = await this.bdService.listarAutoMovimientos(this.usuarioService.usuario);
      this.autoMovimientos = registros.map(a => ({
        id: a.id!,
        nombre: a.nombre,
        monto: a.monto,
        frecuencia: a.frecuencia,
        fechaFactura: new Date(a.fechaFactura),
        tipo: a.tipo
      }));
    } catch (error) {
      this.autoMovimientos = [];
    }
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

    this.autoMovimientosFiltrados = this.autoMovimientos.filter(a => {
      if (desde && a.fechaFactura < desde) {
        return false;
      }
      if (hasta && a.fechaFactura > hasta) {
        return false;
      }
      return true;
    });

    this.totalCredito = this.autoMovimientosFiltrados
      .filter(a => a.tipo === 'credito')
      .reduce((total, a) => total + a.monto, 0);

    this.totalDebito = this.autoMovimientosFiltrados
      .filter(a => a.tipo === 'debito')
      .reduce((total, a) => total + a.monto, 0);
  }

  async eliminar(autoMovimiento: AutoMovimientoVista) {
    const alert = await this.alertController.create({
      header: 'Eliminar movimiento automático',
      message: `¿Seguro que deseas eliminar "${autoMovimiento.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.bdService.eliminarAutoMovimiento(autoMovimiento.id);
              await this.cargarAutoMovimientos();
              this.aplicarFiltro();
            } catch (error) {
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo eliminar el movimiento automático.',
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

}
