import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

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
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  ingresar() {
    if (!this.usuarioPattern.test(this.usuario) || !this.contrasenaPattern.test(this.contrasena)) {
      return;
    }

    this.usuarioService.usuario = this.usuario;

    this.router.navigate(['/home'], { replaceUrl: true });
  }

  irRegistro() {
    this.router.navigate(['/registro']);
  }

}
