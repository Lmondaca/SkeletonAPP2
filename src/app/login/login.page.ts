import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ingresar() {
    if (!this.usuarioPattern.test(this.usuario) || !this.contrasenaPattern.test(this.contrasena)) {
      return;
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        usuario: this.usuario
      },
      replaceUrl: true
    };

    this.router.navigate(['/home'], navigationExtras);
  }

}
