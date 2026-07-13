import { Injectable } from '@angular/core';

const STORAGE_KEY = 'skeletonapp_usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Se respalda en localStorage para que la sesión sobreviva a un refresh
  // (el propio campo, en memoria, se perdería al recargar la página).
  private _usuario = localStorage.getItem(STORAGE_KEY) ?? '';

  get usuario(): string {
    return this._usuario;
  }

  set usuario(valor: string) {
    this._usuario = valor;

    if (valor) {
      localStorage.setItem(STORAGE_KEY, valor);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

}
