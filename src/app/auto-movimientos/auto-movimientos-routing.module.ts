import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoMovimientosPage } from './auto-movimientos.page';

const routes: Routes = [
  {
    path: '',
    component: AutoMovimientosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoMovimientosPageRoutingModule {}
