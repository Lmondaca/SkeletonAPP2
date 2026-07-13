import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  get usuario(): string {
    return this.usuarioService.usuario;
  }

  irPerfil() {
    this.router.navigate(['/perfil']);
  }

  irMovimiento() {
    this.router.navigate(['/movimiento']);
  }

  irMovimientos() {
    this.router.navigate(['/movimientos']);
  }

  irAutoMovi() {
    this.router.navigate(['/auto-movi']);
  }

  irAutoMovimientos() {
    this.router.navigate(['/auto-movimientos']);
  }

  irResumen() {
    this.router.navigate(['/resumen']);
  }

}
