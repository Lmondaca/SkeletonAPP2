import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

// UsuarioService respalda la sesión en localStorage, así que sobrevive a un
// refresh de la app.
export const authGuard: CanActivateFn = () => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  if (usuarioService.usuario) {
    return true;
  }

  return router.parseUrl('/login');
};
