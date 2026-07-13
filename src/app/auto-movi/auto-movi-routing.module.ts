import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutoMoviPage } from './auto-movi.page';

const routes: Routes = [
  {
    path: '',
    component: AutoMoviPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutoMoviPageRoutingModule {}
