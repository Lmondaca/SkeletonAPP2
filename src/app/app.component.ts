import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { AutoMoviProcesadorService } from './services/auto-movi-procesador.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private autoMoviProcesadorService: AutoMoviProcesadorService
  ) {}

  async ngOnInit() {
    if (this.usuarioService.usuario) {
      try {
        await this.autoMoviProcesadorService.procesar(this.usuarioService.usuario);
      } catch (error) {
        // Si falla la generación automática no debe bloquear el arranque de la app.
      }
    }
  }

  cerrarSesion() {
    this.usuarioService.usuario = '';
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
