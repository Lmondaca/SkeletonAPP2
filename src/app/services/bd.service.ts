import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

export interface UsuarioRegistrado {
  nombre: string;
  apellido: string;
  usuario: string;
  contrasena: string;
}

export interface Perfil {
  usuario: string;
  nombre: string;
  apellido: string;
  nivelEducacion: string;
  fechaNacimiento: string;
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

    await this.db.executeSql(
      `CREATE TABLE IF NOT EXISTS perfiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        nombre TEXT NOT NULL,
        apellido TEXT NOT NULL,
        nivel_educacion TEXT NOT NULL,
        fecha_nacimiento TEXT NOT NULL,
        FOREIGN KEY (usuario) REFERENCES usuarios (usuario)
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

  async guardarPerfil(perfil: Perfil): Promise<void> {
    await this.listo;

    if (!this.db) {
      throw new Error('SQLite no está disponible en este entorno (solo funciona en el dispositivo nativo).');
    }

    await this.db.executeSql(
      `INSERT INTO perfiles (usuario, nombre, apellido, nivel_educacion, fecha_nacimiento)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(usuario) DO UPDATE SET
         nombre = excluded.nombre,
         apellido = excluded.apellido,
         nivel_educacion = excluded.nivel_educacion,
         fecha_nacimiento = excluded.fecha_nacimiento`,
      [perfil.usuario, perfil.nombre, perfil.apellido, perfil.nivelEducacion, perfil.fechaNacimiento]
    );
  }

  async obtenerPerfil(usuario: string): Promise<Perfil | null> {
    await this.listo;

    if (!this.db) {
      throw new Error('SQLite no está disponible en este entorno (solo funciona en el dispositivo nativo).');
    }

    const resultado = await this.db.executeSql(
      'SELECT usuario, nombre, apellido, nivel_educacion, fecha_nacimiento FROM perfiles WHERE usuario = ?',
      [usuario]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const fila = resultado.rows.item(0);
    return {
      usuario: fila.usuario,
      nombre: fila.nombre,
      apellido: fila.apellido,
      nivelEducacion: fila.nivel_educacion,
      fechaNacimiento: fila.fecha_nacimiento
    };
  }

}
