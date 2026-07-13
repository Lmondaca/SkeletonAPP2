import { CanActivateFn } from '@angular/router';

// TODO: hoy no hay persistencia de sesión (UsuarioService vive solo en memoria),
// así que se asume siempre autenticado. Reemplazar por una verificación real
// (token/sesión guardada) cuando se implemente persistencia.
export const authGuard: CanActivateFn = () => {
  return true;
};
