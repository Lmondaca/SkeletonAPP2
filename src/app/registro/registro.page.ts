import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BdService } from '../services/bd.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {

  nombre = '';
  apellido = '';
  usuario = '';
  contrasena = '';
  confirmarContrasena = '';

  private readonly usuarioPattern = /^[a-zA-Z0-9]{3,8}$/;
  private readonly contrasenaPattern = /^[0-9]{4}$/;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private bdService: BdService
  ) {}

  get contrasenasNoCoinciden(): boolean {
    return this.confirmarContrasena.length > 0 && this.contrasena !== this.confirmarContrasena;
  }

  async registrar() {
    if (
      !this.nombre ||
      !this.apellido ||
      !this.usuarioPattern.test(this.usuario) ||
      !this.contrasenaPattern.test(this.contrasena) ||
      this.contrasena !== this.confirmarContrasena
    ) {
      return;
    }

    try {
      await this.bdService.guardarUsuario({
        nombre: this.nombre,
        apellido: this.apellido,
        usuario: this.usuario,
        contrasena: this.contrasena
      });

      this.router.navigate(['/login']);
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo registrar el usuario. Es posible que el nombre de usuario ya exista.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
