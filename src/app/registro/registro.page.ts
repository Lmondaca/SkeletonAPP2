import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  get contrasenasNoCoinciden(): boolean {
    return this.confirmarContrasena.length > 0 && this.contrasena !== this.confirmarContrasena;
  }

  registrar() {
    if (
      !this.nombre ||
      !this.apellido ||
      !this.usuarioPattern.test(this.usuario) ||
      !this.contrasenaPattern.test(this.contrasena) ||
      this.contrasena !== this.confirmarContrasena
    ) {
      return;
    }

    this.router.navigate(['/login']);
  }

}
