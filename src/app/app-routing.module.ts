import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'home',
    canActivate: [authGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'movimiento',
    canActivate: [authGuard],
    loadChildren: () => import('./movimiento/movimiento.module').then( m => m.MovimientoPageModule)
  },
  {
    path: 'movimientos',
    canActivate: [authGuard],
    loadChildren: () => import('./movimientos/movimientos.module').then( m => m.MovimientosPageModule)
  },
  {
    path: 'auto-movi',
    canActivate: [authGuard],
    loadChildren: () => import('./auto-movi/auto-movi.module').then( m => m.AutoMoviPageModule)
  },
  {
    path: 'auto-movimientos',
    canActivate: [authGuard],
    loadChildren: () => import('./auto-movimientos/auto-movimientos.module').then( m => m.AutoMovimientosPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'resumen',
    canActivate: [authGuard],
    loadChildren: () => import('./resumen/resumen.module').then( m => m.ResumenPageModule)
  },
  {
    path: 'not-found',
    loadChildren: () => import('./not-found/not-found.module').then( m => m.NotFoundPageModule)
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
