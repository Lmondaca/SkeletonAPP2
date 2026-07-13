import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BdService } from '../services/bd.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-auto-movi',
  templateUrl: './auto-movi.page.html',
  styleUrls: ['./auto-movi.page.scss'],
  standalone: false,
})
export class AutoMoviPage {

  nombre = '';
  monto: number | null = null;
  frecuencia: 'mensual' | 'anual' = 'mensual';
  fechaFactura: Date | null = null;
  tipo: 'debito' | 'credito' = 'debito';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private bdService: BdService,
    private usuarioService: UsuarioService
  ) {}

  async guardar() {
    if (!this.nombre || this.monto == null || this.monto <= 0 || !this.fechaFactura) {
      return;
    }

    try {
      await this.bdService.agregarAutoMovimiento({
        usuario: this.usuarioService.usuario,
        nombre: this.nombre,
        monto: this.monto,
        frecuencia: this.frecuencia,
        fechaFactura: this.fechaFactura.toISOString(),
        tipo: this.tipo
      });

      const alert = await this.alertController.create({
        header: 'Movimiento Automático',
        message: 'Movimiento automático guardado correctamente.',
        buttons: ['OK']
      });
      await alert.present();

      this.nombre = '';
      this.monto = null;
      this.frecuencia = 'mensual';
      this.fechaFactura = null;
      this.tipo = 'debito';
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo guardar el movimiento automático.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  irAutoMovimientos() {
    this.router.navigate(['/auto-movimientos']);
  }

}
