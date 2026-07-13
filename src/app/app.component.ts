import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  cerrarSesion() {
    this.usuarioService.usuario = '';
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
