import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotseatPage } from './hotseat.page';

const routes: Routes = [
  {
    path: '',
    component: HotseatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotseatPageRoutingModule {}
