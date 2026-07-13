import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage {

  nombre = '';
  apellido = '';
  nivelEducacion = '';
  fechaNacimiento: Date | null = null;

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService
  ) {}

  get usuario(): string {
    return this.usuarioService.usuario;
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
