import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoloBasePageRoutingModule } from './solo-base-routing.module';

import { SoloBasePage } from './solo-base.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SoloBasePageRoutingModule
  ],
  declarations: [SoloBasePage]
})
export class SoloBasePageModule {}
