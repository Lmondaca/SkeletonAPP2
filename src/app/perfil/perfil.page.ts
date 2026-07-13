import { Component } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { UsuarioService } from '../services/usuario.service';
import { BdService } from '../services/bd.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false,
})
export class PerfilPage implements ViewWillEnter {

  nombre = '';
  apellido = '';
  nivelEducacion = '';
  fechaNacimiento: Date | null = null;

  constructor(
    private alertController: AlertController,
    private usuarioService: UsuarioService,
    private bdService: BdService
  ) {}

  private readonly edadMinima = 18;

  get usuario(): string {
    return this.usuarioService.usuario;
  }

  get esMenorDeEdad(): boolean {
    if (!this.fechaNacimiento) {
      return false;
    }

    const hoy = new Date();
    let edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
    const aunNoCumpleAnios =
      hoy.getMonth() < this.fechaNacimiento.getMonth() ||
      (hoy.getMonth() === this.fechaNacimiento.getMonth() && hoy.getDate() < this.fechaNacimiento.getDate());

    if (aunNoCumpleAnios) {
      edad--;
    }

    return edad < this.edadMinima;
  }

  async ionViewWillEnter() {
    try {
      const perfil = await this.bdService.obtenerPerfil(this.usuario);
      if (perfil) {
        this.nombre = perfil.nombre;
        this.apellido = perfil.apellido;
        this.nivelEducacion = perfil.nivelEducacion;
        this.fechaNacimiento = new Date(perfil.fechaNacimiento);
      }
    } catch (error) {
      // SQLite no disponible (p. ej. ejecutando en el navegador con ionic serve).
    }
  }

  async guardar() {
    if (!this.nombre || !this.apellido || !this.nivelEducacion || !this.fechaNacimiento || this.esMenorDeEdad) {
      return;
    }

    try {
      await this.bdService.guardarPerfil({
        usuario: this.usuario,
        nombre: this.nombre,
        apellido: this.apellido,
        nivelEducacion: this.nivelEducacion,
        fechaNacimiento: this.fechaNacimiento.toISOString()
      });

      const alert = await this.alertController.create({
        header: 'Perfil',
        message: 'Los datos se guardaron correctamente.',
        buttons: ['OK']
      });
      await alert.present();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo guardar el perfil.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

}
