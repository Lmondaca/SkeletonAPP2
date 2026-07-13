import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AutoMoviService } from '../services/auto-movi.service';

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
    private alertController: AlertController,
    private autoMoviService: AutoMoviService
  ) {}

  async guardar() {
    if (!this.nombre || this.monto == null || !this.fechaFactura) {
      return;
    }

    this.autoMoviService.agregar({
      nombre: this.nombre,
      monto: this.monto,
      frecuencia: this.frecuencia,
      fechaFactura: this.fechaFactura,
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
  }

}
