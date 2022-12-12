import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoloBasePage } from './solo-base.page';

const routes: Routes = [
  {
    path: '',
    component: SoloBasePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SoloBasePageRoutingModule {}
