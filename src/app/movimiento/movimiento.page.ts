import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.page.html',
  styleUrls: ['./movimiento.page.scss'],
  standalone: false,
})
export class MovimientoPage {

  descripcion = '';
  monto: number | null = null;
  tipo: 'debito' | 'credito' = 'debito';
  fechaMovimiento: Date | null = new Date();

  constructor(
    private router: Router,
    private alertController: AlertController,
    private bdService: BdService,
    private usuarioService: UsuarioService
  ) {}

  async guardar() {
    try {
      await this.bdService.agregarMovimiento({
        usuario: this.usuarioService.usuario,
        descripcion: this.descripcion,
        monto: this.monto ?? 0,
        tipo: this.tipo,
        fechaMovimiento: (this.fechaMovimiento ?? new Date()).toISOString()
      });

      const alert = await this.alertController.create({
        header: 'Movimiento',
        message: 'Movimiento guardado correctamente.',
        buttons: ['OK']
      });
      await alert.present();

      this.descripcion = '';
      this.monto = null;
      this.tipo = 'debito';
      this.fechaMovimiento = new Date();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo guardar el movimiento.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  irMovimientos() {
    this.router.navigate(['/movimientos']);
  }

}
