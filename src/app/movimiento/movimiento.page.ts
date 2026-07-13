import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { MovimientoService } from '../services/movimiento.service';

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
    private movimientoService: MovimientoService
  ) {}

  async guardar() {
    this.movimientoService.agregar({
      descripcion: this.descripcion,
      monto: this.monto ?? 0,
      tipo: this.tipo,
      fechaMovimiento: this.fechaMovimiento ?? new Date()
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
  }

  irMovimientos() {
    this.router.navigate(['/movimientos']);
  }

}
