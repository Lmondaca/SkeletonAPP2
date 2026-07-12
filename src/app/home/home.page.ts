import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  usuario = '';

  nombre = '';
  apellido = '';
  nivelEducacion = '';
  fechaNacimiento: Date | null = null;

  private readonly nivelesEducacion: { [key: string]: string } = {
    basica: 'Educación Básica',
    media: 'Educación Media',
    tecnica: 'Técnica/Profesional',
    universitaria: 'Universitaria',
    postgrado: 'Postgrado'
  };

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.usuario = params['usuario'] ?? '';
    });
  }

  limpiar() {
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = null;
  }

  async mostrar() {
    const alert = await this.alertController.create({
      header: 'Usuario',
      message: `Nombre: ${this.nombre || '-'}\nApellido: ${this.apellido || '-'}`,
      buttons: ['OK']
    });
    await alert.present();
  }

}
