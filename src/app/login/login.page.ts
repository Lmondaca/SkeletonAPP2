import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { BdService } from '../services/bd.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  usuario = '';
  contrasena = '';

  private readonly usuarioPattern = /^[a-zA-Z0-9]{3,8}$/;
  private readonly contrasenaPattern = /^[0-9]{4}$/;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private bdService: BdService
  ) { }

  ngOnInit() {
  }

  async ingresar() {
    if (!this.usuarioPattern.test(this.usuario) || !this.contrasenaPattern.test(this.contrasena)) {
      return;
    }

    try {
      const credencialesValidas = await this.bdService.validarCredenciales(this.usuario, this.contrasena);

      if (!credencialesValidas) {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Usuario o contraseña incorrectos.',
          buttons: ['OK']
        });
        await alert.present();
        return;
      }

      this.usuarioService.usuario = this.usuario;

      this.router.navigate(['/home'], { replaceUrl: true });
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo validar el usuario.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }

}
