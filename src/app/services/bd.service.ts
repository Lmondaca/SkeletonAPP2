import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

export interface UsuarioRegistrado {
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class BdService {

  private db: SQLiteObject | null = null;
  private readonly listo: Promise<void>;

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.listo = this.iniciarBd();
  }

  private async iniciarBd(): Promise<void> {
    await this.platform.ready();

    if (!this.platform.is('cordova')) {
      // SQLite nativo solo está disponible en el dispositivo (Android/iOS),
      // no al correr la app en el navegador (ionic serve).
      return;
    }

    this.db = await this.sqlite.create({
      name: 'skeletonapp.db',
      location: 'default'
    });

    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        usuario TEXT NOT NULL UNIQUE,
        contrasena TEXT NOT NULL
      )`,
      []
    );
  }

  async guardarUsuario(usuario: UsuarioRegistrado): Promise<void> {
    await this.listo;

    if (!this.db) {
      throw new Error('SQLite no está disponible en este entorno (solo funciona en el dispositivo nativo).');
    }

    await this.db.executeSql(
      'INSERT INTO usuarios (nombre, apellido, usuario, contrasena) VALUES (?, ?, ?, ?)',
      [usuario.nombre, usuario.apellido, usuario.usuario, usuario.contrasena]
    );
  }

  async validarCredenciales(usuario: string, contrasena: string): Promise<boolean> {
    await this.listo;

    if (!this.db) {
      throw new Error('SQLite no está disponible en este entorno (solo funciona en el dispositivo nativo).');
    }

    const resultado = await this.db.executeSql(
      'SELECT id FROM usuarios WHERE usuario = ? AND contrasena = ?',
      [usuario, contrasena]
    );

    return resultado.rows.length > 0;
  }

}
